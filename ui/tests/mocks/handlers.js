import { rest } from "msw";

const baseUrl = "/api/accounts";

export const handlers = [
  rest.get(`${baseUrl}`, async (req, res, ctx) => {
    return res(
      ctx.json([
        [
          {
            name: "alice",
            balance: 0,
            id: 1,
          },
        ],
      ])
    );
  }),
];
