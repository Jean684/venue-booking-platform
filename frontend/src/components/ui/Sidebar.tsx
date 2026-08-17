import { GridItem, Heading, List, ListItem, Input, calc } from "@chakra-ui/react";
import { px, vh } from "framer-motion";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import { RiDashboardFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import { FaNewspaper } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";
// https://stackoverflow.com/questions/74270017/type-icontype-is-not-assignable-to-type-reactnode

import { useEffect, useState } from "react";

export default function Sidebar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Simulate fetching user data
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } 

    }, []);

    return(
        <>
            <GridItem
                as={"aside"}
                colSpan={1}
                // bg={"#59020c"}
                minHeight={"100vh"}
            >
                {/* Only render if user is hirer */}
                {user?.role === "hirer" && (
                <List>
                    <SidebarLink href="/hirer"         label="Dashboard"      icon={ RiDashboardFill }></SidebarLink>
                    <SidebarLink href="/hirer/profile"       label="Profile"        icon={ FaUser }></SidebarLink>
                    <SidebarLink href="/hirer/history"       label="Hiring History" icon={ FaHistory }></SidebarLink>
                    <SidebarLink href="/hirer/document"      label="Document"       icon={ FaNewspaper }></SidebarLink>
                    <SidebarLink href="/hirer/saved-venues"  label="Saved Venues"   icon={ IoBookmark }></SidebarLink>                    
                </List>
                )}

                {/* Only render if user is vendor */}   
                {user?.role === "vendor" && (
                <List>
                    <SidebarLink href="/vendor/dashboard"    label="Dashboard"      icon={ RiDashboardFill }></SidebarLink> 
                    <SidebarLink href="/vendor/profile"      label="Profile"        icon={ FaUser }></SidebarLink>
                    <SidebarLink href="/vendor/applications" label="Applications"   icon={ FaNewspaper }></SidebarLink> 
                    <SidebarLink href="/vendor/analytics"    label="Analytics"      icon={FaChartPie}/>
                   
                </List>
                )}  
                
            </GridItem>
        </>
    )
}