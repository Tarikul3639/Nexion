"use client";
import React from "react";
import { Classroom } from "@/types/classroom";

interface ClassroomListProps {
  classrooms: Classroom[];
  selectedClassroom?: Classroom;
  onSelectClassroom: (cls: Classroom) => void;
}

export default function ClassroomList({ classrooms, selectedClassroom, onSelectClassroom }: ClassroomListProps) {
  return (
    <div className="w-full h-full overflow-auto">
      {classrooms.length === 0 && <p className="text-gray-500">No classrooms available</p>}
      {classrooms.map((cls) => (
        <div
          key={cls.id}
          onClick={() => onSelectClassroom(cls)}
          className={`p-2 cursor-pointer rounded hover:bg-gray-200 ${
            selectedClassroom?.id === cls.id ? "bg-gray-300 font-semibold" : ""
          }`}
        >
          {cls.name}
        </div>
      ))}
    </div>
  );
}
