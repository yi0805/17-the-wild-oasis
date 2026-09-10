import styled from "styled-components";

import { useUser } from "../authentication/useUser";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function getStringMetadataValue(metadata: unknown, key: string) {
  if (typeof metadata !== "object" || metadata === null) return "";

  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function UserAvatar() {
  const { user } = useUser();
  const fullName = getStringMetadataValue(user?.user_metadata, "fullName") || "User";
  const avatar = getStringMetadataValue(user?.user_metadata, "avatar");

  return (
    <StyledUserAvatar>
      <Avatar src={avatar || "default-user.jpg"} alt={fullName} />
      <span>{fullName}</span>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
