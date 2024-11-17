import { defineConfig } from "@abstract-money/cli";
import { react, registry, vanilla } from "@abstract-money/cli/plugins";

export default defineConfig({
  out: "app/_generated/generated-abstract",
  contracts: [
    {
      name: "my_app",
      path: "../contracts/my_app/schema/abstract",
      namespace: "payment1",
      version: "0.1.0",
      moduleType: "app",
    },
    //     {
    //       name: "",
    //       path: "../contracts//schema/abstract",
    //       namespace: "payment1",
    //       version: "0.1.0",
    //       moduleType: "adapter",
    //     }
    //     {
    //       name: "",
    //       // standalone contracts don't use the abstract folder
    //       path: "../contracts//schema",
    //       namespace: "payment1",
    //       version: "0.1.0",
    //     }
  ],
  plugins: [
    react({
      disableAbstractAppFor: ["cw20-base"],
    }),
    vanilla({
      enableAbstractAppFor: [
        "my_app",
        // '',
      ],
    }),
    registry({
      contracts: [
        {
          namespace: "cw-plus",
          name: "cw20-base",
          version: "1.0.1",
        },
      ],
    }),
  ],
});
