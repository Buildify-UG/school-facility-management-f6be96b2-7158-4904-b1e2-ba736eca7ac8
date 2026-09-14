import { useState } from "react";
import { Plus, Package, Users, BarChart3, Download, Upload, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReceiptReportForm } from "@/components/ReceiptReportForm";
import { useAuth } from "@/contexts/AuthContext";

interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  category: string;
  quantity: number;
  condition: "Baik" | "Rusak Ringan" | "Rusak Berat";
  lastUpdated: string;
}

interface BorrowRecord {
  id: string;
  itemId: string;
  itemName: string;
  borrowedBy: string;
  borrowDate: string;
  returnDate: string | null;
  status: "Dipinjam" | "Dikembalikan";
}

const SAMPLE_INVENTORY: InventoryItem[] = [
  {
    id: "1",
    barcode: "SMK-LAB-001",
    name: "Mikroskop",
    category: "Alat Lab",
    quantity: 5,
    condition: "Baik",
    lastUpdated: "2024-09-14",
  },
  {
    id: "2",
    barcode: "SMK-RUANG-001",
    name: "Ruang Kelas A",
    category: "Ruangan",
    quantity: 1,
    condition: "Baik",
    lastUpdated: "2024-09-14",
  },
  {
    id: "3",
    barcode: "SMK-PERALATAN-001",
    name: "Kursi Plastik",
    category: "Peralatan",
    quantity: 50,
    condition: "Rusak Ringan",
    lastUpdated: "2024-09-13",
  },
  {
    id: "4",
    barcode: "SMK-ELEKTRONIK-001",
    name: "Proyektor",
    category: "Elektronik",
    quantity: 3,
    condition: "Baik",
    lastUpdated: "2024-09-12",
  },
  {
    id: "5",
    barcode: "SMK-BUKU-001",
    name: "Buku Referensi Teknik",
    category: "Buku",
    quantity: 25,
    condition: "Rusak Ringan",
    lastUpdated: "2024-09-11",
  },
];

const SAMPLE_BORROWS: BorrowRecord[] = [
  {
    id: "1",
    itemId: "1",
    itemName: "Mikroskop",
    borrowedBy: "Guru Biologi",
    borrowDate: "2024-09-14",
    returnDate: null,
    status: "Dipinjam",
  },
  {
    id: "2",
    itemId: "3",
    itemName: "Kursi Plastik",
    borrowedBy: "Ruang Rapat",
    borrowDate: "2024-09-12",
    returnDate: "2024-09-13",
    status: "Dikembalikan",
  },
  {
    id: "3",
    itemId: "4",
    itemName: "Proyektor",
    borrowedBy: "Guru Matematika",
    borrowDate: "2024-09-10",
    returnDate: "2024-09-11",
    status: "Dikembalikan",
  },
];

const CATEGORIES = ["Alat Lab", "Peralatan", "Ruangan", "Buku", "Elektronik"];

export default function Index() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>(SAMPLE_INVENTORY);
  const [borrows, setBorrows] = useState<BorrowRecord[]>(SAMPLE_BORROWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [activeTab, setActiveTab] = useState("dashboard");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const activeLoans = borrows.filter((b) => b.status === "Dipinjam").length;
  const damagedItems = inventory.filter((item) => item.condition !== "Baik").length;

  const handleExportCSV = () => {
    const headers = ["Barcode", "Nama", "Kategori", "Jumlah", "Kondisi", "Terakhir Diupdate"];
    const rows = inventory.map((item) => [
      item.barcode,
      item.name,
      item.category,
      item.quantity,
      item.condition,
      item.lastUpdated,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-export.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-lg">
              SMK
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sistem Inventaris Sekolah</h1>
              <p className="text-sm text-muted-foreground">SMK MA'ARIF 1 KEBUMEN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventaris</TabsTrigger>
            <TabsTrigger value="borrow">Peminjaman</TabsTrigger>
            <TabsTrigger value="receipt">Laporan Penerimaan</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <p className="text-xs text-muted-foreground">{inventory.length} jenis barang</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Peminjaman Aktif</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeLoans}</div>
                  <p className="text-xs text-muted-foreground">sedang dipinjam</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Barang Rusak</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{damagedItems}</div>
                  <p className="text-xs text-muted-foreground">perlu perbaikan</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kategori</CardTitle>
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{CATEGORIES.length}</div>
                  <p className="text-xs text-muted-foreground">jenis kategori</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Barang Terbaru Diperbarui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventory.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.barcode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{item.quantity} unit</p>
                        <p
                          className={`text-xs ${
                            item.condition === "Baik" ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {item.condition}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 gap-2">
                <Input
                  placeholder="Cari nama atau barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Semua">Semua Kategori</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Barang
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Barcode</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Nama Barang</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Kategori</th>
                        <th className="text-center font-medium text-muted-foreground py-3 px-4">Jumlah</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Kondisi</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.map((item) => (
                        <tr key={item.id} className="border-b border-border hover:bg-card/50">
                          <td className="py-3 px-4 font-mono text-xs">{item.barcode}</td>
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">{item.category}</td>
                          <td className="py-3 px-4 text-center font-medium">{item.quantity}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                item.condition === "Baik"
                                  ? "bg-green-100 text-green-800"
                                  : item.condition === "Rusak Ringan"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.condition}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Borrow Tab */}
          <TabsContent value="borrow" className="space-y-6">
            <div className="flex gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Peminjaman Baru
              </Button>
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Scan Barcode
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Riwayat Peminjaman</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Barang</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Peminjam</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Tanggal Pinjam</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Tanggal Kembali</th>
                        <th className="text-left font-medium text-muted-foreground py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrows.map((record) => (
                        <tr key={record.id} className="border-b border-border hover:bg-card/50">
                          <td className="py-3 px-4 font-medium">{record.itemName}</td>
                          <td className="py-3 px-4">{record.borrowedBy}</td>
                          <td className="py-3 px-4">{record.borrowDate}</td>
                          <td className="py-3 px-4">{record.returnDate || "-"}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                record.status === "Dipinjam"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Receipt Report Tab */}
          <TabsContent value="receipt" className="space-y-6">
            <ReceiptReportForm />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Impor Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Impor data inventaris dari file CSV
                  </p>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih File CSV
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ekspor Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Ekspor semua data inventaris ke CSV
                  </p>
                  <Button variant="outline" className="w-full" onClick={handleExportCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Manajemen Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Kelola akses pengguna berdasarkan jabatan
                  </p>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Kelola Pengguna
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Kategori Barang</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Tambah atau edit kategori barang
                  </p>
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Kelola Kategori
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
