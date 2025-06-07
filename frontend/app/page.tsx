"use client";

import React, { useState, useCallback } from "react";
import StatCard from "./components/stat";
import { Stat } from "@/types/stat";

// Define API URL in a simple way
const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_ENDPOINT;

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Stat[] | null>(null);

  const fetchData = useCallback(async () => {
    if (!API_URL) {
      setError("API URL is not defined.");
      setData(null);
      return;
    }
    // Set states
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const fetchedData: Stat[] = await response.json();
      setData(fetchedData);
    } catch (error) {
      setError(`An error occurred while fetching data - ${error}`);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdate = useCallback(
    async (id: number, newValue: number) => {
      if (!API_URL) {
        setError("API URL is not defined.");
        setData(null);
        return;
      }
      // Set states
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, value: newValue }),
        });
        if (!response.ok) {
          throw new Error(`Failed to update data with id=${id}`);
        }
        await response.json();
        // Re-fetching data after update for demonstrative purposes, I think
        // this is fine despite the fact the it is not the most efficient way -
        // redundant state updates
        await fetchData();
      } catch (error) {
        setError(`An error occurred while updating data - ${error}`);
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">
        Welcome to the Cache App!
      </h1>
      <p className="text-lg text-[#222] dark:text-gray-400 w-full md:w-xl text-center">
        This is a simple application built with Next.js, Django, Redis, and
        PostgreSQL. It implements caching with Redis and PostgreSQL and uses
        optimistic locking to avoid stale data. Click the button below to fetch
        data from the API.
      </p>
      <div className="flex flex-col items-center gap-4">
        <button
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-500 transition-all rounded-lg cursor-pointer hover:shadow-lg active:scale-95"
          onClick={fetchData}
          disabled={loading}
        >
          Fetch
        </button>
      </div>
      {/*
         I wanted to keep it simple instead of showing a popup or using a toast notification
      */}
      {error && <div className="text-red-500 text-xl">! {error} !</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full max-w-6xl">
        {loading ? (
          <div className="col-span-full text-center text-gray-500 animate-pulse">
            Loading...
          </div>
        ) : data ? (
          data.map((stat) => (
            <StatCard key={stat.id} stat={stat} onUpdate={handleUpdate} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No data has been fetched yet.
          </div>
        )}
      </div>
    </div>
  );
}
