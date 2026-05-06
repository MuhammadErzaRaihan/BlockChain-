// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CertificateSystem {

    // 1. STRUCT: Ini adalah skema data kamu (seperti kolom di tabel SQL)
    struct CertificateData {
        string fileHash;      // Digital Fingerprint dari file
        string recipientName; // Nama penerima sertifikat
        string courseName;    // Nama kegiatan/pelatihan
        uint256 issueDate;    // Timestamp kapan diterbitkan
        address issuer;       // Dompet yang menerbitkan
        bool isValid;         // Status validasi
    }

    // 2. MAPPING: Ini adalah sistem indeks kamu (Primary Key)
    // Mencari data sertifikat berdasarkan 'fileHash'
    mapping(string => CertificateData) public certificates;

    // 3. EVENT: Ini adalah log transaksi untuk dibaca oleh Frontend
    event CertificateMinted(string indexed fileHash, string recipientName, uint256 timestamp);
    event CertificateRevoked(string indexed fileHash, uint256 timestamp);

    // 4. FUNGSI WRITE 1: Insert Data
    function mintCertificate(string memory _fileHash, string memory _name, string memory _course) public {
        // VALIDASI: Pastikan sertifikat dengan hash ini belum pernah ada
        require(!certificates[_fileHash].isValid, "Sertifikat dengan hash ini sudah ada!");
        
        certificates[_fileHash] = CertificateData({
            fileHash: _fileHash,
            recipientName: _name,
            courseName: _course,
            issueDate: block.timestamp,
            issuer: msg.sender,
            isValid: true
        });

        emit CertificateMinted(_fileHash, _name, block.timestamp);
    }

    // 5. FUNGSI WRITE 2: Update Data (Membatalkan sertifikat)
    function revokeCertificate(string memory _fileHash) public {
        // VALIDASI: Pastikan sertifikat ada dan hanya penerbit yang bisa membatalkan
        require(certificates[_fileHash].isValid, "Sertifikat tidak ditemukan atau sudah tidak valid.");
        require(certificates[_fileHash].issuer == msg.sender, "Hanya penerbit yang bisa membatalkan!");

        certificates[_fileHash].isValid = false;

        emit CertificateRevoked(_fileHash, block.timestamp);
    }

    // 6. FUNGSI READ: Select Data
    function verifyCertificate(string memory _fileHash) public view returns (CertificateData memory) {
        require(certificates[_fileHash].isValid, "Sertifikat tidak valid atau tidak ditemukan.");
        return certificates[_fileHash];
    }
}