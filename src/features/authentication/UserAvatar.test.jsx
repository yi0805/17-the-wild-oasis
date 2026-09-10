import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

const { getCurrentuser } = vi.hoisted(() => ({ getCurrentuser: vi.fn() }));

vi.mock("../../services/apiAuth", () => ({ getCurrentuser }));

import UserAvatar from "./UserAvatar";
import { renderWithProviders } from "../../test/renderWithProviders";

function createSyntheticUser(userMetadata) {
  return {
    id: "synthetic-user-id",
    email: "operator@example.invalid",
    role: "authenticated",
    user_metadata: userMetadata,
  };
}

function renderUserAvatar(userMetadata) {
  getCurrentuser.mockResolvedValue(createSyntheticUser(userMetadata));

  return renderWithProviders(<UserAvatar />);
}

describe("UserAvatar", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders normal profile metadata", async () => {
    renderUserAvatar({
      fullName: "Synthetic Operator",
      avatar: "https://example.invalid/avatar.png",
    });

    expect(await screen.findByText("Synthetic Operator")).toBeVisible();
    expect(screen.getByAltText("Synthetic Operator")).toHaveAttribute(
      "src",
      "https://example.invalid/avatar.png",
    );
  });

  it.each([undefined, {}, { avatar: 42 }])(
    "uses the default avatar for absent or invalid avatar metadata",
    async (userMetadata) => {
      renderUserAvatar(userMetadata);

      expect(await screen.findByAltText("User")).toHaveAttribute(
        "src",
        "default-user.jpg",
      );
    },
  );

  it.each([undefined, {}, { fullName: 42 }])(
    "uses a safe fallback for absent or invalid full-name metadata",
    async (userMetadata) => {
      renderUserAvatar(userMetadata);

      expect(await screen.findByText("User")).toBeVisible();
      expect(screen.getByAltText("User")).toBeInTheDocument();
    },
  );
});
