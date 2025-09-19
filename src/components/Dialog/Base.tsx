import React from 'react'
import { Modal, ModalProps, ModalFuncProps } from 'antd'

const defaultProps = {
  centered: true,
}

const Dialog = (props: ModalProps) => {
  const modalProps = {
    ...defaultProps,
    ...props,
  }
  return <Modal {...modalProps} />
}

// 添加 confirm 静态方法
Dialog.confirm = (options: ModalFuncProps) => {
  return Modal.confirm({
    ...defaultProps,
    ...options,
  })
}

// 添加其他便捷方法
Dialog.info = (options: ModalFuncProps) => {
  return Dialog.confirm({
    ...defaultProps,
    ...options,
  })
}

Dialog.success = (options: ModalFuncProps) => {
  return Dialog.confirm({
    ...defaultProps,
    ...options,
  })
}

Dialog.warning = (options: ModalFuncProps) => {
  return Dialog.confirm({
    ...defaultProps,
    ...options,
  })
}

Dialog.error = (options: ModalFuncProps) => {
  return Dialog.confirm({
    ...defaultProps,
    ...options,
  })
}

export default Dialog
