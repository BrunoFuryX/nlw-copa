import { Text, HStack, Box, Icon } from 'native-base';
import { CaretLeft, Export, SignOut } from 'phosphor-react-native';

import { useNavigation } from '@react-navigation/native'

import { ButtonIcon } from './ButtonIcon';
import { useAuth } from '../hooks/UseAuth';

interface Props {
  title: string;
  showBackButton?: boolean;
  showExitButton?: boolean;
  showShareButton?: boolean;
}

export function Header({ title, showExitButton = false, showBackButton = false, showShareButton = false }: Props) {
  const { navigate } = useNavigation()
  const { signOut } = useAuth();

  const EmptyBoxSpace = () => (<Box w={6} h={6} />);

  return (
    <HStack w="full" h={24} bgColor="gray.800" alignItems="flex-end" pb={5} px={5}>
      <HStack w="full" alignItems="center" justifyContent="space-between">
        {
          showBackButton
            ? <ButtonIcon icon={CaretLeft} onPress={() => navigate("pools")} />
            : showExitButton
              ? <ButtonIcon icon={SignOut} onPress={() => signOut()} />
              : <EmptyBoxSpace />
        }



        <Text color="white" fontFamily="medium" fontSize="md" textAlign="center">
          {title}
        </Text>

        {
          showShareButton
            ?
            <ButtonIcon icon={Export} />
            :
            <EmptyBoxSpace />
        }
      </HStack>
    </HStack>
  );
}