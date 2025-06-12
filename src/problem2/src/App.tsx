import { SwapForm } from './components/SwapForm';
import './App.css';
import { ChakraProvider, Container, Heading, VStack } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider value={{} as any}>
      <Container maxW="container.xl" py={8}>
        <VStack>
          <Heading>Currency Swap</Heading>
          <SwapForm />
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
