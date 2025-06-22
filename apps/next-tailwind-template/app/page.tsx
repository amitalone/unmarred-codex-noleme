import Image from "next/image";
import { Card } from "@repo/ui/card";
import { Gradient } from "@repo/ui/gradient";
import { TurborepoLogo } from "@repo/ui/turborepo-logo";

export default function Page() {
  return (
    <>
      <Card title="Welcome to the Unmarred Codex!">
        <p className="text-white">
          This is a simple card component built with Tailwind CSS.
        </p>
      </Card>
    </>
  );
}
