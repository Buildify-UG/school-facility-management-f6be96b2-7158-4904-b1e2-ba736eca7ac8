import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ReceiptReportFormProps {
  onSubmit?: (data: any) => void;
}

export function ReceiptReportForm({ onSubmit }: ReceiptReportFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    submitterName: user?.name || '',
    receiptNumber: '',
    class: '',
    department: '',
    itemName: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.submitterName || !formData.receiptNumber || !formData.itemName) {
        toast.error('Mohon isi semua field yang wajib');
        return;
      }

      // Simulate sending to admin
      console.log('Report submitted:', formData);
      toast.success(`Laporan penerimaan #${formData.receiptNumber} terkirim ke admin`);
      
      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form
      setFormData({
        submitterName: user?.name || '',
        receiptNumber: '',
        class: '',
        department: '',
        itemName: '',
        notes: '',
      });
    } catch (error) {
      toast.error('Gagal mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Laporan Penerimaan Barang</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submitter Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Pelapor *</Label>
              <Input
                id="name"
                value={formData.submitterName}
                onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                placeholder="Nama lengkap"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receipt">Nomor Penerimaan *</Label>
              <Input
                id="receipt"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                placeholder="Contoh: RCP-2024-001"
                required
              />
            </div>
          </div>

          {/* Class/Department - conditional */}
          {user?.role === 'guru' && (
            <div className="space-y-2">
              <Label htmlFor="class">Kelas/Jurusan (jika siswa) *</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="Contoh: XII RPL 1"
              />
            </div>
          )}

          {user?.role === 'guru' && (
            <div className="space-y-2">
              <Label htmlFor="dept">Jurusan (jika siswa)</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger id="dept">
                  <SelectValue placeholder="Pilih jurusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RPL">Rekayasa Perangkat Lunak</SelectItem>
                  <SelectItem value="TKJ">Teknik Komputer Jaringan</SelectItem>
                  <SelectItem value="MM">Multimedia</SelectItem>
                  <SelectItem value="AKL">Akuntansi</SelectItem>
                  <SelectItem value="DKV">Desain Komunikasi Visual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Item Info */}
          <div className="space-y-2">
            <Label htmlFor="item">Nama Barang *</Label>
            <Input
              id="item"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="Nama barang yang diterima"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Kondisi barang, jumlah, atau keterangan lainnya..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Laporan ke Admin'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  submitterName: user?.name || '',
                  receiptNumber: '',
                  class: '',
                  department: '',
                  itemName: '',
                  notes: '',
                })
              }
            >
              Bersihkan
            </Button>
          </div>

          {/* Admin Info */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-medium">📞 Laporan akan dikirim ke:</p>
            <p>Admin: 0811158980</p>
            <p className="text-xs text-blue-700 mt-2">Status laporan dapat dipantau di menu Peminjaman</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
