import {toggleLoadingModal, toggleModal} from '.';

export const actionToggleModal = (
  payload = {
    data: null,
    visible: false,
    shouldCloseModalWhenTapOverlay: false,
  },
) => {
  return toggleModal(payload);
};
export const actionToggleLoadingModal = (
  payload = {
    toggle: false,
    title: '',
    desc: '',
  },
) => {
  return toggleLoadingModal(payload);
};
