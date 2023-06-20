import {
  Button,
  Container,
  Muted,
  Bold,
  render,
  Text,
  MiddleAlign,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit, once } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback } from 'preact/hooks'

import { CloseHandler, CreateExportHandler, CopyToClipboardHandler } from './types'

import { copyToClipboard } from './utils/copyToClipboard';


const Plugin = () => {

  const handleCloseButtonClick = useCallback(() => {
    emit<CloseHandler>('CLOSE')
  }, []);

  const handleCreateExport = useCallback(() => {
    emit<CreateExportHandler>('CREATE_EXPORT')
  }, [])

  once<CopyToClipboardHandler>('COPY_TO_CLIPBOARD', (json) => {
    copyToClipboard(json);
    handleCloseButtonClick();
  })

  return (
    <Container space="medium">
      <MiddleAlign>
        <Text align="center">
          <Bold>Select all Stickies</Bold>
        </Text>
        <VerticalSpace space="small" />
        <Text align="center">
          <Muted>AND</Muted>
        </Text>
        <VerticalSpace space="small" />
        <Button fullWidth onClick={handleCreateExport}>
          Copy To Clipboard
        </Button>
      </MiddleAlign>
    </Container>
  )
}

export default render(Plugin)
