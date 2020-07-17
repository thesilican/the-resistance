import React, { ReactNode } from "react";

type NameTransformerProps = {
  children: string;
  names: string[];
  colors: string[];
};

const pattern = /\[\[(\d+|fail:.+?|success:.+?)\]\]/;

function NameTransformer({
  children: text,
  names,
  colors,
}: NameTransformerProps) {
  const splits: ReactNode[] = text.split(pattern);

  for (let i = 1; i < splits.length; i += 2) {
    const trimmed = splits[i] as string;
    if (trimmed.startsWith("fail:") || trimmed.startsWith("success:")) {
      const s = trimmed.startsWith("fail:") ? "fail" : "success";
      splits[i] = (
        <span key={i} className={"c-" + s + " font-weight-bold"}>
          {trimmed.substring(s === "fail" ? 5 : 8)}
        </span>
      );
    } else {
      let x = parseInt(trimmed, 10);
      if (isNaN(x) || x >= names.length || x >= colors.length) {
        continue;
      }
      splits[i] = (
        <span key={i} className={"c-" + colors[x] + " font-weight-bold"}>
          {names[x]}
        </span>
      );
    }
  }

  return <>{splits}</>;
}

export default React.memo(NameTransformer);
