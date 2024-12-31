"use client";

import React, { useState, useEffect } from "react";
import Skeleton from "./Skeleton";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactsDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  React.useEffect(() => {
    // Simulate data loading or fetch your cart data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        `/api/contacts${
          filter !== "ALL" ? `?filter=${filter.toLowerCase()}` : ""
        }`
      );
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="p-4">
      {/* Filter Buttons */}
      <div className="flex p-4 gap-4 mb-6 bg-white rounded-lg">
        {["ALL", "EVENTS", "PROGRAM"].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-sm ${
              filter === filterOption
                ? "bg-[#14AE5C] text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {filterOption}
          </button>
        ))}
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-base font-medium text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <Skeleton />
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => handleContactClick(contact)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {contact.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedContact.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedContact.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedContact.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedContact.subject}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="w-full bg-[#14AE5C] text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
