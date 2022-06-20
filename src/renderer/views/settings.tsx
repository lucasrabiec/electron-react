import { Flex, Heading, FormControl, FormLabel, Select, Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { ChangeEvent, useCallback, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { StoreType } from '../../utils/consts';

type SettingsType = Partial<StoreType>;

const schema = z.object({
  resolution: z.string(),
});

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>();
  const { register, handleSubmit } = useForm<SettingsType>({
    resolver: zodResolver(schema),
  });

  useEffectOnce(() => {
    (async () => {
      setSettings((await window.electron.store.getAll()) as SettingsType);
    })();
  });

  const onResolutionChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prevState) => ({ ...prevState, resolution: event.target.value }));
  }, []);

  const onSubmit = async ({ resolution }: SettingsType) => {
    window.electron.store.set('resolution', resolution);
  };

  return (
    <Flex flexDir='column' gap={2}>
      <Heading>Settings</Heading>
      <Flex as='form' flexDir='column' gap={4} onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>App starting resolution</FormLabel>
          <Select {...register('resolution')} value={settings?.resolution} onChange={onResolutionChange}>
            <option value='1280,720'>1280 x 720</option>
            <option value='1920,1080'>1920 x 1080</option>
            <option value='max'>Max</option>
          </Select>
        </FormControl>
        <Flex justify='flex-end' w='100%'>
          <Button w='100%' maxW={200} type='submit' colorScheme='orange'>
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
