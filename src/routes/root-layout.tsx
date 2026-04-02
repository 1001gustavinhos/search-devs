import { Box, Container } from "@chakra-ui/react";
import { Outlet, useLocation } from "@tanstack/react-router";

export function RootLayout() {
  const { pathname } = useLocation();
  const isProfileRoute = pathname.startsWith("/profile/");

  return (
    <Box minH="100vh" bg="brand.pageBg" display="flex" alignItems="center">
      <Container
        maxW="container.lg"
        py={{ base: 6, md: 8 }}
        px={{ base: isProfileRoute ? 0 : 4, md: 4 }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
