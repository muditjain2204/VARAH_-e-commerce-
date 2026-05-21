'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Upload, IndianRupee, Image as ImageIcon, ChevronRight } from 'lucide-react';
import styles from './add.module.css';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    stockCount: '10',
    category: 'sarees',
    subcategory: '',
    fabric: '',
    color: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
  });
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('varah_user');
    if (userStr) {
      setShopName(JSON.parse(userStr).name);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('varah_token');
      if (!token) throw new Error('You must be logged in to add products.');

      // Format payload for the backend
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        discount: form.discount ? Number(form.discount) : undefined,
        stockCount: Number(form.stockCount),
        category: form.category,
        subcategory: form.subcategory,
        fabric: form.fabric,
        color: form.color,
        images: [form.image1, form.image2, form.image3, form.image4, form.image5].filter(Boolean),
      };

      const res = await fetch('http://localhost:5000/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.message);
      }

      alert('Product added successfully!');
      router.push('/products'); // Redirect to products to see it!
      
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <h1><Package size={24} style={{ display: 'inline', marginRight: '10px' }} /> Add New Product</h1>
          <p>List a new item in your shop's inventory.</p>
        </div>

        <div className={styles.formCard}>
          {error && <div className="error-alert" style={{ marginBottom: '20px', color: 'red', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* Basic Info */}
            <div className={styles.section}>
              <h3>Basic Details</h3>
              <div className={styles.fieldFull}>
                <label>Seller / Shop Name</label>
                <input type="text" value={shopName} disabled style={{ backgroundColor: '#f5f5f5', color: '#666' }} />
              </div>
              <div className={styles.fieldFull}>
                <label>Product Name *</label>
                <input required type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Maroon Handwoven Banarasi Saree" />
              </div>
              <div className={styles.fieldFull}>
                <label>Description *</label>
                <textarea required name="description" value={form.description} onChange={handleChange} rows="4" placeholder="Describe the craftsmanship, fabric, and occasions to wear this..."></textarea>
              </div>
            </div>

            {/* Pricing */}
            <div className={styles.section}>
              <h3>Pricing & Inventory</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Selling Price (₹) *</label>
                  <div className={styles.inputWithIcon}>
                    <IndianRupee size={16} />
                    <input required type="number" name="price" value={form.price} onChange={handleChange} placeholder="4999" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>MRP / Original Price (₹)</label>
                  <div className={styles.inputWithIcon}>
                    <IndianRupee size={16} />
                    <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} placeholder="6999" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Discount (%)</label>
                  <input type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="e.g. 25" />
                </div>
                <div className={styles.field}>
                  <label>Stock Available *</label>
                  <input required type="number" name="stockCount" value={form.stockCount} onChange={handleChange} placeholder="10" />
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className={styles.section}>
              <h3>Attributes</h3>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Category *</label>
                  <select required name="category" value={form.category} onChange={handleChange}>
                    <option value="sarees">Sarees</option>
                    <option value="lehengas">Lehengas</option>
                    <option value="kurtis">Kurtis & Sets</option>
                    <option value="traditional-wear">Traditional Wear</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Subcategory</label>
                  <input type="text" name="subcategory" value={form.subcategory} onChange={handleChange} placeholder="e.g. Banarasi, Chanderi" />
                </div>
                <div className={styles.field}>
                  <label>Fabric</label>
                  <input type="text" name="fabric" value={form.fabric} onChange={handleChange} placeholder="e.g. Pure Silk, Cotton" />
                </div>
                <div className={styles.field}>
                  <label>Color</label>
                  <input type="text" name="color" value={form.color} onChange={handleChange} placeholder="e.g. Maroon, Sage Green" />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className={styles.section}>
              <h3>Product Images</h3>
              <div style={{ padding: '12px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
                <strong>Note:</strong> Required 5 photos for customer convenience.
              </div>
              <div className={styles.fieldFull}>
                <label>Image URL 1 (Main Image) *</label>
                <div className={styles.inputWithIcon}>
                  <ImageIcon size={16} />
                  <input required type="text" name="image1" value={form.image1} onChange={handleChange} placeholder="/images/products/saree-1.png" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Image URL 2</label>
                  <input type="text" name="image2" value={form.image2} onChange={handleChange} placeholder="Secondary image" />
                </div>
                <div className={styles.field}>
                  <label>Image URL 3</label>
                  <input type="text" name="image3" value={form.image3} onChange={handleChange} placeholder="Alternative angle" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Image URL 4</label>
                  <input type="text" name="image4" value={form.image4} onChange={handleChange} placeholder="Close up shot" />
                </div>
                <div className={styles.field}>
                  <label>Image URL 5</label>
                  <input type="text" name="image5" value={form.image5} onChange={handleChange} placeholder="Packaging or lifestyle shot" />
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
                {loading ? 'Publishing Product...' : 'Publish Product to Store'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
