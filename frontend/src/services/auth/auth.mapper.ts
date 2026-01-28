import type { TokenDTO } from "./auth.dto";
import type { Token } from "./auth.model";

export const authMapper = {
  toToken: (dto: TokenDTO): Token => ({
    accessToken: dto.access_token,
    tokenType: dto.token_type,
  }),
};
