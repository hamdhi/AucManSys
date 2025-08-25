"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "./Login/page"; // adjust the path if Login is in a different folder

export default function Home() {
  return <Login />;
}
