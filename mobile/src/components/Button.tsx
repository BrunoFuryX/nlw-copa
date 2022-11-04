import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

interface Props extends IButtonProps {
  title: string;
  type?: 'PRIMARY' | 'SECUNDARY';
}

export function Button({ title, type = 'PRIMARY', ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      textTransform="uppercase"
      bg={type === 'SECUNDARY' ? 'red.500' : "yellow.500"}
      _pressed={{
        bg: type === 'SECUNDARY' ? "red.400" : "yellow.600"
      }}
      _loading={{
        _spinner: { color: type === 'SECUNDARY' ? 'white' : "black" }
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        color={type === 'SECUNDARY' ? 'white' : "black"}
      >
        {title}
      </Text>
    </ButtonNativeBase >
  );
}