"use client";

import React from "react";

const OPEN = "\u007B";
const CLOSE = "\u007D";

const suggestions = [
  { icon: "⚠", title: "Weak password detected", desc: "Avoid storing plain-text credentials in source code." },
  { icon: "🔒", title: "Security vulnerability", desc: "Use environment variables or a secrets manager." },
  { icon: "⚡", title: "Suggest password hashing", desc: "e.g. bcrypt or Argon2 for secure verification." },
];

export default function CodeDemoSection() {
  return React.createElement(
    "div",
    {
      className: "border-t border-white/5 py-16 sm:py-20 md:py-24",
      role: "region",
      "aria-label": "Code demo",
    },
    React.createElement(
      "div",
      { className: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" },
      React.createElement(
        "h2",
        { className: "mb-12 text-center text-3xl font-bold text-white sm:text-4xl" },
        "See it in action"
      ),
      React.createElement(
        "div",
        { className: "grid gap-6 lg:grid-cols-2 lg:gap-8" },
        React.createElement(
          "div",
          {
            className:
              "overflow-hidden rounded-xl border border-white/10 bg-[#1F2937] shadow-lg",
          },
          React.createElement(
            "div",
            {
              className: "flex items-center gap-2 border-b border-white/10 bg-[#161b22]/80 px-4 py-3 backdrop-blur",
            },
            React.createElement("span", { className: "h-3 w-3 rounded-full bg-red-500/80" }),
            React.createElement("span", { className: "h-3 w-3 rounded-full bg-yellow-500/80" }),
            React.createElement("span", { className: "h-3 w-3 rounded-full bg-green-500/80" }),
            React.createElement("span", {
              className: "ml-3 text-xs font-medium text-white/60",
              children: "authenticate.js",
            })
          ),
          React.createElement(
            "pre",
            {
              className: "overflow-x-auto p-5 font-mono text-sm leading-relaxed text-[#e6edf3]",
            },
            React.createElement(
              "code",
              {},
              React.createElement("span", { className: "text-purple-400", children: "function" }),
              " ",
              React.createElement("span", { className: "text-[#79c0ff]", children: "authenticate" }),
              React.createElement("span", { className: "text-[#e6edf3]", children: `(password) ${OPEN}` }),
              "\n  ",
              React.createElement("span", { className: "text-purple-400", children: "if" }),
              React.createElement("span", { className: "text-[#e6edf3]", children: " (password == " }),
              React.createElement("span", { className: "text-[#a5d6ff]", children: '"123456"' }),
              React.createElement("span", { className: "text-[#e6edf3]", children: `) ${OPEN}` }),
              "\n    ",
              React.createElement("span", { className: "text-purple-400", children: "return" }),
              " ",
              React.createElement("span", { className: "text-[#79c0ff]", children: "true" }),
              ";\n  ",
              React.createElement("span", { className: "text-[#e6edf3]", children: CLOSE }),
              "\n  ",
              React.createElement("span", { className: "text-purple-400", children: "return" }),
              " ",
              React.createElement("span", { className: "text-[#79c0ff]", children: "false" }),
              ";\n",
              React.createElement("span", { className: "text-[#e6edf3]", children: CLOSE })
            )
          )
        ),
        React.createElement(
          "div",
          { className: "flex flex-col gap-4" },
          suggestions.map((item, i) =>
            React.createElement(
              "div",
              {
                key: item.title,
                className:
                  "animate-fade-in-up rounded-xl border border-white/10 bg-[#1F2937] p-5 shadow-lg",
                style: { animationDelay: `${(i + 1) * 200}ms`, opacity: 0 },
              },
              React.createElement(
                "div",
                { className: "flex items-start gap-3" },
                React.createElement("span", {
                  className: "text-xl",
                  "aria-hidden": true,
                  children: item.icon,
                }),
                React.createElement(
                  "div",
                  {},
                  React.createElement("p", {
                    className: "font-semibold text-white",
                    children: item.title,
                  }),
                  React.createElement("p", {
                    className: "mt-1 text-sm text-white/60",
                    children: item.desc,
                  })
                )
              )
            )
          )
        )
      )
    )
  );
}
