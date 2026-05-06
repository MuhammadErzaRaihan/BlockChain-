const hre = require("hardhat");

async function main() {
    console.log("Mulai melakukan deployment database (Smart Contract)...");

    // 1. Proses Deployment (Mirip seperti 'CREATE TABLE' di SQL)
    const Certificate = await hre.ethers.getContractFactory("CertificateSystem");
    const cert = await Certificate.deploy();

    await cert.waitForDeployment();
    const address = await cert.getAddress();
    console.log("✅ Database berhasil dibuat pada alamat:", address);

    // 2. Simulasi INSERT Data (Fungsi Write)
    console.log("\n[1/2] Menyimpan data sertifikat baru...");
    // Kita menggunakan data contoh untuk diuji
    const testHash = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"; 

    const tx = await cert.mintCertificate(testHash, "Sheila Sabina", "Pelatihan Blockchain 101");
    await tx.wait(); // Menunggu blok selesai ditambang
    console.log("✅ Data berhasil disimpan ke blockchain!");

    // 3. Simulasi SELECT Data (Fungsi Read)
    console.log("\n[2/2] Mengambil data dari blockchain untuk verifikasi...");
    const dataSertifikat = await cert.verifyCertificate(testHash);

    console.log("✅ Data ditemukan:");
    console.log("   - Nama Penerima :", dataSertifikat.recipientName);
    console.log("   - Nama Kegiatan :", dataSertifikat.courseName);
    console.log("   - Status Valid  :", dataSertifikat.isValid);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});