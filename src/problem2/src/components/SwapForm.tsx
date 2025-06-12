import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Select,
  VStack,
  HStack,
  Image,
  Text,
  useToast,
  FormControl,
  FormLabel,

} from '@chakra-ui/react';
import { getAvailableTokens, getTokenIcon } from '../services/tokenService';
import type { Token } from '../types/token';


export const SwapForm = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    const loadTokens = async () => {
      const availableTokens = await getAvailableTokens();
      setTokens(availableTokens);
      if (availableTokens.length >= 2) {
        setFromToken(availableTokens[0]);
        setToToken(availableTokens[1]);
      }
    };
    loadTokens();
  }, []);

  useEffect(() => {
    if (fromToken?.price && toToken?.price) {
      setRate(fromToken.price / toToken.price);
    }
  }, [fromToken, toToken]);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Success',
        description: `Swapped ${amount} ${fromToken.symbol} to ${(Number(amount) * rate).toFixed(6)} ${toToken.symbol}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to swap tokens',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleFromTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const token = tokens.find(t => t.symbol === e.target.value);
    if (token) setFromToken(token);
  };

  const handleToTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const token = tokens.find(t => t.symbol === e.target.value);
    if (token) setToToken(token);
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={8}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <VStack gap={4}>
        <FormControl>
          <FormLabel>From</FormLabel>
          <HStack>
            <Select value={fromToken?.symbol} onChange={handleFromTokenChange} size="lg">
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </Select>
            {fromToken && (
              <Image
                src={getTokenIcon(fromToken.symbol)}
                alt={fromToken.symbol}
                boxSize="24px"
                fallback={<Box boxSize="24px" bg="gray.200" borderRadius="full" />}
              />
            )}
          </HStack>
        </FormControl>

        <Button
          size="sm"
          onClick={handleSwitchTokens}
          variant="ghost"
          alignSelf="center"
        >
          Switch
        </Button>

        <FormControl>
          <FormLabel>To</FormLabel>
          <HStack>
            <Select value={toToken?.symbol} onChange={handleToTokenChange} size="lg">
              {tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </Select>
            {toToken && (
              <Image
                src={getTokenIcon(toToken.symbol)}
                alt={toToken.symbol}
                boxSize="24px"
                fallback={<Box boxSize="24px" bg="gray.200" borderRadius="full" />}
              />
            )}
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            size="lg"
          />
        </FormControl>

        {rate > 0 && (
          <Text fontSize="sm" color="gray.500" textAlign="center">
            1 {fromToken?.symbol} = {rate.toFixed(6)} {toToken?.symbol}
          </Text>
        )}

        <Button
          colorScheme="blue"
          width="full"
          onClick={handleSwap}
          isLoading={isLoading}
          loadingText="Swapping..."
          size="lg"
        >
          Swap
        </Button>
      </VStack>
    </Box>
  );
};
