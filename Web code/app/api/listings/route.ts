
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

/*
export async function POST(
    request: Request 
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const{
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,  
        price,
    } = body;

    
    // Improved validation
    for (const key of ["title", "description", "imageSrc", "category", "roomCount", "bathroomCount", "guestCount", "location", "price"]) {
        if (!body[key]) {
            return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
        }
    }

    if (!location?.value) {
        return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const listing = await prisma.listing.create({
        data:{
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
}  */ 
export async function POST(
    request: Request 
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await request.json();
    const{
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,  
        price,
    } = body;

    // Improved validation
    for (const key of ["title", "description", "imageSrc", "category", "roomCount", "bathroomCount", "guestCount", "location", "price"]) {
        if (!body[key]) {
            return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
        }
    }

    if (!location?.value) {
        return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const listing = await prisma.listing.create({
        data:{
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
}