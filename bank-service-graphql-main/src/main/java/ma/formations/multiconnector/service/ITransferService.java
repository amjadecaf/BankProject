package ma.formations.multiconnector.service;

import ma.formations.multiconnector.dtos.transfer.TransferRequest;
import ma.formations.multiconnector.dtos.transfer.TransferResponse;

public interface ITransferService {
    TransferResponse executeTransfer(TransferRequest request, String username);
}
