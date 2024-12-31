import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// In src/app/api/contacts/route.ts, add this GET handler
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
  
    try {
      const contacts = await prisma.contact.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      if (filter) {
        const filteredContacts = contacts.filter(contact => {
          const subject = contact.subject.toUpperCase();
          if (filter === 'events') {
            return subject.includes('GREAT RIFT RUN');
          } else if (filter === 'program') {
            return (
              subject.includes('RUN WITH LEGENDS') ||
              subject.includes('OPEN SEASON COURSE') ||
              subject.includes('SCHOOL CAMP')
            );
          }
          return true;
        });
        return NextResponse.json(filteredContacts);
      }
  
      return NextResponse.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch contacts" },
        { status: 500 }
      );
    }
  }