INSERT INTO [dbo].[application] (
    [eventName],
    [guestCount],
    [startDate],
    [endDate],
    [status],
    [comment],
    [venueVenueId],
    [userId]
)
VALUES
('Emma''s Birthday Bash', 80, '2026-06-01', '2026-06-01', 'Accepted', NULL,
 '3fabfe48-b854-f111-8545-02035a628741', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),

('Engagement Party', 150, '2026-06-05', '2026-06-05', 'Rejected', NULL,
 '3fabfe48-b854-f111-8545-02035a628741', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

('Corporate Networking Night', 120, '2026-06-10', '2026-06-10', 'Pending', NULL,
 '45abfe48-b854-f111-8545-02035a628741', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),

('Birthday Celebration', 60, '2026-06-15', '2026-06-15', 'Accepted', 'Client has too many requests',
 '41abfe48-b854-f111-8545-02035a628741', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),

('Wedding Reception', 200, '2026-06-20', '2026-06-20', 'Accepted', '',
 '40abfe48-b854-f111-8545-02035a628741', 'cccccccc-cccc-cccc-cccc-cccccccccccc'),

('Startup Launch Party', 100, '2026-06-25', '2026-06-25', 'Accepted', 'Need AV equipment setup before event.',
 '40abfe48-b854-f111-8545-02035a628741', 'cccccccc-cccc-cccc-cccc-cccccccccccc');