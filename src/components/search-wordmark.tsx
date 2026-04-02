import { Heading, Text } from "@chakra-ui/react";

type SearchWordmarkProps = {
  fontSize: string | Record<string, string>;
  textAlign?: "left" | "center" | "right";
};

export function SearchWordmark({
  fontSize,
  textAlign = "center",
}: SearchWordmarkProps) {
  return (
    <Heading
      as="h1"
      textAlign={textAlign}
      letterSpacing="tight"
      fontSize={fontSize}
      lineHeight="1"
      fontWeight="medium"
      whiteSpace="nowrap"
      flexShrink={0}
    >
      <Text
        as="span"
        color="brand.searchBlue"
        fontFamily="'Nunito', sans-serif"
        fontWeight="medium"
      >
        Search
      </Text>{" "}
      <Text
        as="span"
        color="brand.accent"
        fontFamily="'Nunito', sans-serif"
        fontWeight="medium"
      >
        d
      </Text>
      <Text
        as="span"
        color="brand.accent"
        fontFamily="'Nunito', sans-serif"
        fontWeight="bold"
      >
        _
      </Text>
      <Text
        as="span"
        color="brand.accent"
        fontFamily="'Nunito', sans-serif"
        fontWeight="medium"
      >
        evs
      </Text>
    </Heading>
  );
}
