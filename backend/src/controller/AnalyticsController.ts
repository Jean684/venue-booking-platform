import { application, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Application } from "../entity/Application";
import { Venue } from "../entity/Venue";
import { User } from "../entity/User";

type AnalyticsRange =
  | "this-week"
  | "this-month"
  | "last-month"
  | "all-time";

interface DateRange {
  start: Date;
  end: Date;
}

interface LoadedApplication {
    application: Application;
    venue: Venue;
    user: User;
}

export class AnalyticsController {
  private applicationRepository = AppDataSource.getRepository(Application);
  private venueRepository = AppDataSource.getRepository(Venue);

  async getAnalytics(req: Request, res: Response) {
    try {
      const vendorId = req.params.vendorId;

      const requestedRange =
        (req.query.range as AnalyticsRange | undefined) ?? "this-month";

      const supportedRanges: AnalyticsRange[] = [
        "this-week",
        "this-month",
        "last-month",
        "all-time",
      ];

      if (!supportedRanges.includes(requestedRange)) {
        return res.status(400).json({
          error:
            "Invalid range. Use this-week, this-month, last-month, or all-time.",
        });
      }

      const ownedVenues = await this.venueRepository.find({
        where: { vendorId },
      });

      const ownedVenueIds = new Set(
        ownedVenues.map((venue) => venue.venueId)
      );

      const acceptedApplications = await this.applicationRepository.find({
        where: { status: "Accepted" },
        relations: ["user", "venue"],
      });

      const loadedAcceptedApplications: LoadedApplication[] = await Promise.all(
        acceptedApplications.map(async (application) => ({
            application,
            venue: await application.venue,
            user: await application.user,
        }))
      );

      const vendorApplications = loadedAcceptedApplications.filter(({venue}) =>
        ownedVenueIds.has(venue.venueId)
      );

      const selectedRange = this.getDateRange(
        requestedRange,
        vendorApplications.map(({ application }) => application)
      );

      const filteredApplications = vendorApplications.filter(({ application }) =>
        this.overlapsRange(
          this.toDate(application.startDate),
          this.toDate(application.endDate),
          selectedRange
        )
      );

      // Bar chart: hirer tallies grouped by venue
      const venueTallies = ownedVenues.map((venue) => {
        const venueApplications = filteredApplications.filter(
          ({ venue: applicationVenue }) =>
                applicationVenue.venueId === venue.venueId
        );

        const hirerMap = new Map<
          string,
          {
            hirerId: string;
            hirerName: string;
            tally: number;
          }
        >();

        for (const { user } of venueApplications) {
          const hirerId = user.id;
          const hirerName = user.name || user.email;

          const existing = hirerMap.get(hirerId);

          if (existing) {
            existing.tally += 1;
          } else {
            hirerMap.set(hirerId, {
              hirerId,
              hirerName,
              tally: 1,
            });
          }
        }

        return {
          venueId: venue.venueId,
          venueName: venue.heading || "Unnamed Venue",
          hirers: Array.from(hirerMap.values()),
        };
      });

      // Stacked bar chart: each hirer's tallies across venues
      const combinedMap = new Map<
        string,
        {
          hirerId: string;
          hirerName: string;
          venueId: string;
          venueName: string;
          tally: number;
        }
      >();

      for (const { user, venue } of filteredApplications) {
        const hirerId = user.id;
        const hirerName = user.name || user.email;
        const venueId = venue.venueId;
        const venueName = venue.heading || "Unnamed Venue";

        const key = `${hirerId}-${venueId}`;
        const existing = combinedMap.get(key);

        if (existing) {
          existing.tally += 1;
        } else {
          combinedMap.set(key, {
            hirerId,
            hirerName,
            venueId,
            venueName,
            tally: 1,
          });
        }
      }

      const combinedTallies = Array.from(combinedMap.values());

      // Pie chart: accepted booking tallies for active hirers
      const hirerActivityMap = new Map<
        string,
        {
          hirerId: string;
          hirerName: string;
          tally: number;
        }
      >();

      for (const { user } of filteredApplications) {
        const hirerId = user.id;
        const hirerName = user.name || user.email;

        const existing = hirerActivityMap.get(hirerId);

        if (existing) {
          existing.tally += 1;
        } else {
          hirerActivityMap.set(hirerId, {
            hirerId,
            hirerName,
            tally: 1,
          });
        }
      }

      const hirerActivity = Array.from(hirerActivityMap.values()).sort(
        (a, b) => b.tally - a.tally
      );

      const mostActiveHirer =
        hirerActivity.length > 0 ? hirerActivity[0] : null;

      const leastActiveHirer =
        hirerActivity.length > 0
          ? [...hirerActivity].sort((a, b) => a.tally - b.tally)[0]
          : null;

      const utilizationTimeline = this.buildUtilizationTimeline(
        filteredApplications,
        selectedRange,
        ownedVenues.length
      );

      return res.json({
        range: requestedRange,
        venueCount: ownedVenues.length,
        acceptedBookingCount: filteredApplications.length,
        venueTallies,
        combinedTallies,
        hirerActivity,
        mostActiveHirer,
        leastActiveHirer,
        utilizationTimeline,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  private getDateRange(
    range: AnalyticsRange,
    applications: Application[]
  ): DateRange {
    const today = this.startOfDay(new Date());

    if (range === "this-week") {
      const start = new Date(today);
      const day = start.getDay();
      const differenceFromMonday = day === 0 ? -6 : 1 - day;

      start.setDate(start.getDate() + differenceFromMonday);

      return {
        start,
        end: today,
      };
    }

    if (range === "this-month") {
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };
    }

    if (range === "last-month") {
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    }

    if (applications.length === 0) {
      return {
        start: today,
        end: today,
      };
    }

    const starts = applications.map((application) =>
      this.toDate(application.startDate).getTime()
    );

    const ends = applications.map((application) =>
      this.toDate(application.endDate).getTime()
    );

    return {
      start: new Date(Math.min(...starts)),
      end: new Date(Math.max(...ends)),
    };
  }

  private buildUtilizationTimeline(
    applications: LoadedApplication[],
    range: DateRange,
    ownedVenueCount: number
  ) {
    if (ownedVenueCount === 0) {
      return [];
    }

    const timeline: {
      date: string;
      utilizationPercentage: number;
    }[] = [];

    const currentDate = new Date(range.start);

    while (currentDate <= range.end) {
      const activeVenueIds = new Set<string>();

      for (const { application, venue } of applications) {
        const bookingStart = this.toDate(application.startDate);
        const bookingEnd = this.toDate(application.endDate);

        if (currentDate >= bookingStart && currentDate <= bookingEnd) {
            activeVenueIds.add(venue.venueId);
        }
      }

      const utilizationPercentage = Number(
        ((activeVenueIds.size / ownedVenueCount) * 100).toFixed(2)
      );

      timeline.push({
        date: this.formatDate(currentDate),
        utilizationPercentage,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return timeline;
  }

  private overlapsRange(
    bookingStart: Date,
    bookingEnd: Date,
    selectedRange: DateRange
  ) {
    return (
      bookingStart <= selectedRange.end &&
      bookingEnd >= selectedRange.start
    );
  }

  private toDate(value: Date | string) {
    const dateText = String(value).slice(0, 10);
    return new Date(`${dateText}T00:00:00`);
  }

  private startOfDay(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}