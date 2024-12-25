"use client";

import React from "react";
import BookPrepItem from "./book-prep-item";
import BookPrepDrawer from "./bookprep-drawer";
import BookPrepFilter from "./book-prep-filter";

export default function BookPrepList() {
  return (
    <section className="space-y-8">
      <BookPrepFilter />
      <BookPrepItem />
      <BookPrepDrawer />
    </section>
  );
}
