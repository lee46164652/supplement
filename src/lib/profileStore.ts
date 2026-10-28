"use client";

import { createLocalStore } from "./store";
import type { Profile } from "./profile";

export const profileStore = createLocalStore<Profile | null>("supplement-profile", null);
