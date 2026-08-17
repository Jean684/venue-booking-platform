import { GridItem, Heading, List, ListItem, Input, calc } from "@chakra-ui/react";
import { px, vh } from "framer-motion";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import { RiDashboardFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { FaNewspaper } from "react-icons/fa6";
import { User } from "@/types/types";
// https://stackoverflow.com/questions/74270017/type-icontype-is-not-assignable-to-type-reactnode

import { useEffect, useState } from "react";

export default function Sidebar() {
    const [user, setUser] = useState<User | null>(null);

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

                {/* Only render if user is admin */}   
                {user?.role === "admin" && (
                <List>
                    <SidebarLink href="/admin/dashboard"    label="Dashboard"      icon={ RiDashboardFill }></SidebarLink> 
                </List>
                )}  
                
            </GridItem>
        </>
    )
}