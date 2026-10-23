import { type Project } from "@n8v/site/components/screens/projects";
import React from "react";

export const useProjects = () =>
	React.useMemo(
		() =>
			[
				{
					description:
						"A simple counter app compiled to WebAssembly, written in Rust.",
					frameUrl: "/apps/counter",
					title: "Wasm Counter",
					url: "/apps/counter",
				},
				{
					description:
						"An MCP Server that enables AI assistants to interact with your local browsers.",
					title: "MCP Browser Kit",
					url: "https://github.com/ndthanhdev/mcp-browser-kit",
				},
				{
					description:
						"How this website works: concepts, how-tos and what happens under the hood.",
					title: "Handbook",
					url: "/handbook",
				},
			] satisfies Project[],
		[],
	);
