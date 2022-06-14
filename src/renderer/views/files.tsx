import { Button, Flex, Heading, Text, Textarea } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Channel } from '../../utils/consts';

const { ipcRenderer } = window.electron;

export default function Files() {
  const [text, setText] = useState('');

  const onSaveClick = useCallback(async () => {
    await ipcRenderer.invoke(Channel.FILES_SAVE_DIALOG, [text]);
  }, [text]);

  const onLoadClick = useCallback(async () => {
    const fileContent = await ipcRenderer.invoke(Channel.FILES_OPEN_DIALOG, []);
    if (typeof fileContent === 'string') {
      setText(fileContent);
    }
  }, []);

  return (
    <Flex flexDir='column' h='100%'>
      <Heading>Files</Heading>
      <Text>Data:</Text>
      <Textarea
        w='100%'
        h='100%'
        bg='white'
        color='black'
        resize='none'
        value={text}
        onChange={(val) => setText(val.target.value)}
      />
      <Flex justify='space-evenly' mt={4}>
        <Button colorScheme='orange' onClick={onLoadClick}>
          LOAD
        </Button>
        <Button colorScheme='orange' onClick={onSaveClick}>
          SAVE
        </Button>
      </Flex>
    </Flex>
  );
}
