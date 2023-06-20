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


function unsecuredCopyToClipboard(text: string) {
  // Create a textarea element
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);

  // Focus and select the textarea content
  textArea.focus();
  textArea.select();

  // Attempt to copy the text to the clipboard
  try {
    document.execCommand('copy');
  } catch (e) {
    // logger.error('Unable to copy content to clipboard!', e);
  }

  // Remove the textarea element from the DOM
  document.body.removeChild(textArea);
}

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 *
 * Inspired by: https://stackoverflow.com/questions/71873824/copy-text-to-clipboard-cannot-read-properties-of-undefined-reading-writetext
 * and https://forum.figma.com/t/write-to-clipboard-from-custom-plugin/11860/12
 *
 * @param content - The content to be copied to the clipboard
 */
function copyToClipboard(content: string) {
  // If the context is secure and clipboard API is available, use it
  if (
    window.isSecureContext &&
    typeof navigator?.clipboard?.writeText === 'function'
  ) {
    navigator.clipboard.writeText(content);
  }
  // Otherwise, use the unsecured fallback
  else {
    unsecuredCopyToClipboard(content);
  }
}


function Plugin() {

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
