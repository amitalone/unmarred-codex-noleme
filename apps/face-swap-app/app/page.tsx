"use client";
import { OutputPage } from "@repo/face-swap-ui/outputPage";

const demoImages = [
  {
    src: "http://localhost:8000/output/2025/05/27/face-003.jpg--model_f11t82u0.png--_00001_.png",
    alt: "Nature image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Architecture",
    alt: "Architecture image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/800x800/3357FF/fff&text=People",
    alt: "People image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/900x600/FF33DA/000&text=Technology",
    alt: "Technology image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/600x900/33DAFF/000&text=Animals",
    alt: "Animals image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/800x500/DAFF33/000&text=Travel",
    alt: "Travel image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/700x900/FF8C33/fff&text=Food",
    alt: "Food image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/800x700/8C33FF/fff&text=Sports",
    alt: "Sports image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/600x600/33FF8C/000&text=Art",
    alt: "Art image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/900x700/FF338C/fff&text=Fashion",
    alt: "Fashion image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Architecture",
    alt: "Architecture image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/800x800/3357FF/fff&text=People",
    alt: "People image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/900x600/FF33DA/000&text=Technology",
    alt: "Technology image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Architecture",
    alt: "Architecture image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/800x800/3357FF/fff&text=People",
    alt: "People image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
  {
    src: "https://dummyimage.com/900x600/FF33DA/000&text=Technology",
    alt: "Technology image",
    type: "Output",
    face: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Face`,
      type: "Face",
    },
    model: {
      src: `https://dummyimage.com/128x128/${Math.floor(Math.random() * 16777215).toString(16)}/${Math.floor(Math.random() * 16777215).toString(16)}&text=Model`,
      type: "Model",
    },
  },
];

export default function Page() {
  return (
    <>
      <OutputPage images={demoImages} title="Results Gallery" />
    </>
  );
}
