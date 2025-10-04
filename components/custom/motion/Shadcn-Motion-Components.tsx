"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export const M_Card = motion(Card);
export const M_CardTitle = motion(CardTitle);
export const M_CardHeader = motion(CardHeader);
export const M_CardContent = motion(CardContent);
export const M_CardDescription = motion(CardDescription);
export const M_CardFooter = motion(CardFooter);
export const M_Link = motion(Link);
export const M_Image = motion(Image);
