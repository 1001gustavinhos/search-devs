import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "@tanstack/react-router";

export function RootLayout() {
  return (
    <Box minH="100vh" bg="brand.pageBg" display="flex" alignItems="center">
      <Container maxW="container.lg" py={{ base: 6, md: 8 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
