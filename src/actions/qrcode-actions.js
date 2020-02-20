import Swal from "sweetalert2";
import T from "i18n-react/dist/i18n-react";

import {exec} from "../services/wkbridge";

import {
    createAction,
    showMessage
} from "openstack-uicore-foundation/lib/methods";

export const REQUEST_QRCODE = 'REQUEST_QRCODE';
export const RECEIVE_QRCODE = 'RECEIVE_QRCODE';

export const scanQRCode = () => (dispatch, getState) => {

    let { baseState } = getState();
    let { summit }    = baseState;

    return exec(
        createAction(REQUEST_QRCODE),
        createAction(RECEIVE_QRCODE),
        `qrcode`
    )({})(dispatch).then((payload) => {
        let { data } = payload.response;

        if (data.length === 0) {
            Swal.fire(
                T.translate("find_ticket.wrong_qr_title"),
                T.translate("find_ticket.wrong_qr_text"),
                "warning"
            );
        }
        return data;
    });
};
