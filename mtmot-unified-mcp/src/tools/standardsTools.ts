import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const standardsTools = [
  {
    name: "get_always_on_constitution",
    description:
      "Retrieve the Always-On Skill Constitution (v1.0.0) - the non-negotiable governance framework that applies to all AI agent responses in the MTMOT/Carlorbiz ecosystem. This constitution enforces Carla's standards including Australian spelling, strategic consulting posture, MCP-first architecture, multi-agent coordination, commercial awareness, healthcare sensitivity, instructional clarity, and truth discipline. Use this when an agent needs to understand or apply the core operational principles.",
    inputSchema: {
      type: "object" as const,
      properties: {
        version: {
          type: "string",
          description: "Version of the constitution to retrieve (default: 'v1.0.0')",
          enum: ["v1.0.0"],
        },
      },
      required: [],
    },
    handler: async (input: { version?: string }) => {
      const version = input.version || "v1.0.0";

      try {
        // Navigate from src/tools/ to standards/
        const constitutionPath = path.join(
          __dirname,
          "..",
          "..",
          "standards",
          "always_on_skill_constitution",
          `${version}.md`
        );

        const constitutionContent = await fs.readFile(constitutionPath, "utf-8");

        return {
          content: [
            {
              type: "text" as const,
              text: constitutionContent,
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        return {
          content: [
            {
              type: "text" as const,
              text: `Error retrieving Always-On Skill Constitution (${version}): ${errorMessage}\n\nAvailable versions: v1.0.0\nPath attempted: standards/always_on_skill_constitution/${version}.md`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];
