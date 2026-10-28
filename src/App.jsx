import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Star, Heart, X, Plus, Minus, Trash2, 
  CheckCircle, ArrowRight, SlidersHorizontal, Sun, Moon, ShieldCheck, 
  RefreshCw, Truck, Tag, ChevronRight, AlertCircle, Eye
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  { id: 1, name: "Apex Pro Wireless Mechanical Keyboard", category: "Hardware", price: 189.99, rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800", badge: "Best Seller", description: "Crafted with aviation-grade aluminum frame, hot-swappable switches, and customizable RGB per-key illumination." },
  { id: 2, name: "Zenith Studio Noise-Canceling Headphones", category: "Audio", price: 299.99, rating: 4.8, reviews: 94, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800", badge: "New", description: "Immersive spatial audio combined with industry-leading hybrid active noise cancellation and 40-hour battery life." },
  { id: 3, name: "Lumina 4K Ultra-Wide Curved Monitor", category: "Displays", price: 649.99, rating: 4.7, reviews: 62, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800", badge: "Sale", description: "38 inches of crystal clear IPS panel display designed for high-performance productivity and cinematic gaming." },
  { id: 4, name: "Chronos Titanium Smartwatch Series X", category: "Wearables", price: 249.99, rating: 4.6, reviews: 210, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800", description: "Aerospace titanium casing equipped with advanced biometric health tracking, ECG monitor, and water resistance up to 100m." },
  { id: 5, name: "Vortex Ergonomic Precision Gaming Mouse", category: "Hardware", price: 89.99, rating: 4.9, reviews: 185, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800", badge: "Popular", description: "Ultra-lightweight honeycomb shell featuring a 25K DPI optical sensor and zero-latency wireless connectivity." },
  { id: 6, name: "SonicPulse Pocket Bluetooth Speaker", category: "Audio", price: 79.99, rating: 4.5, reviews: 77, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800", description: "Rugged waterproof build delivering crystal high frequencies and deep resonant bass for outdoor adventures." }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [products] = useState(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(700);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const categories = ["All", "Hardware", "Audio", "Displays", "Wearables"];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesPrice = p.price <= priceRange;
    const matchesRating = p.rating >= minRating;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => 
      prev.some(item => item.id === product.id) 
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = subtotal > 150 ? 0 : 15.00;
  const total = Math.max(0, subtotal - discount + (subtotal > 0 ? shipping : 0));

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(subtotal * 0.20);
    } else {
      alert("Invalid Promo Code. Try 'SAVE20'");
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">N</div>
            <div>
              <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">NEXUS</span>
              <span className={`block text-xs font-semibold tracking-widest ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>LUXE STORE</span>
            </div>
          </div>

          <div className="hidden md:flex items-center relative w-96">
            <Search className={`absolute left-3.5 h-4 w-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input 
              type="text"
              placeholder="Search flagship gear, hardware..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-full text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-200 placeholder-slate-500' : 'bg-slate-100 border-slate-200 text-slate-800'}`}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setIsWishlistOpen(true)}
              className={`relative p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Cart</span>
              {cart.reduce((a, c) => a + c.qty, 0) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {cart.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 via-violet-900/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
              <SparklesIcon /> <span>Next-Gen Hardware & Peripheral Architecture</span>
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
              Engineered for Ultimate <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">Performance.</span>
            </h1>
            <p className={`text-lg mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Discover elite tech gear designed without compromises. Premium materials, unmatched tactile precision, and futuristic design aesthetics.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CATALOG AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR FILTERS */}
          <aside className={`lg:col-span-1 p-6 rounded-2xl border h-fit space-y-6 ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold flex items-center space-x-2"><SlidersHorizontal size={16} /> <span>Filters</span></h2>
              <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setPriceRange(700); setMinRating(0); }} className="text-xs text-indigo-400 hover:underline">Reset All</button>
            </div>

            {/* Categories */}
            <div>
              <label className={`block text-xs font-semibold tracking-wider uppercase mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Categories</label>
              <div className="space-y-1.5">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Max Price</span>
                <span className="text-indigo-400">${priceRange}</span>
              </div>
              <input 
                type="range" min="50" max="700" step="10" 
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className={`block text-xs font-semibold tracking-wider uppercase mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'}`}
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Showing <span className="font-bold text-indigo-400">{filteredProducts.length}</span> flagship results
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className={`text-center py-20 rounded-2xl border ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'}`}>
                <AlertCircle className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">No matching products found</h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Try adjusting your filters or search criteria.</p>
                <button onClick={() => { setSelectedCategory("All"); setSearchQuery(""); setPriceRange(700); }} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/30">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const isWishlisted = wishlist.some(item => item.id === product.id);
                  return (
                    <div 
                      key={product.id}
                      className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col ${darkMode ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-400'}`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-slate-900">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {product.badge}
                          </span>
                        )}
                        <button 
                          onClick={() => toggleWishlist(product)}
                          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${isWishlisted ? 'bg-rose-500 text-white border-rose-600' : darkMode ? 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'}`}
                        >
                          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={() => setSelectedProduct(product)}
                          className="absolute inset-x-4 bottom-4 bg-slate-900/80 backdrop-blur-md text-white py-2 rounded-xl text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5"
                        >
                          <Eye size={14} /> <span>Quick View</span>
                        </button>
                      </div>

                      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-indigo-400 font-semibold">{product.category}</span>
                            <div className="flex items-center space-x-1 text-amber-400 font-bold">
                              <Star size={13} fill="currentColor" />
                              <span>{product.rating}</span>
                              <span className={`font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>({product.reviews})</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-base leading-snug line-clamp-1 group-hover:text-indigo-400 transition-colors">{product.name}</h3>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                          <div>
                            <span className={`block text-[10px] uppercase font-semibold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Price</span>
                            <span className="text-lg font-black text-indigo-400">${product.price.toFixed(2)}</span>
                          </div>
                          <button 
                            onClick={() => addToCart(product)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-1.5"
                          >
                            <ShoppingBag size={15} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CART DRAWER SLIDE-OVER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-md p-6 flex flex-col border-l shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <h2 className="text-lg font-bold flex items-center space-x-2">
                  <ShoppingBag size={20} className="text-indigo-500" />
                  <span>Shopping Cart ({cart.reduce((a, c) => a + c.qty, 0)})</span>
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-slate-800 transition-colors"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="mx-auto h-16 w-16 text-slate-600 mb-4 opacity-50" />
                    <p className="font-bold text-lg mb-1">Your cart is empty</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Add some awesome gear to start checkout.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className={`flex items-center space-x-4 p-4 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{item.name}</h4>
                        <p className="text-indigo-400 font-bold text-sm">${item.price.toFixed(2)}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"><Minus size={12} /></button>
                          <span className="text-sm font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"><Plus size={12} /></button>
                        </div>
                      </div>
                      <button onClick={() => updateQty(item.id, -item.qty)} className="text-rose-400 hover:text-rose-300 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-slate-800 space-y-4">
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Promo Code (SAVE20)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`}
                    />
                    <button onClick={applyPromo} className="bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">Apply</button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Discount (20%)</span><span>-${discount.toFixed(2)}</span></div>}
                    <div className="flex justify-between"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Shipping</span><span>{shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${shipping.toFixed(2)}`}</span></div>
                    <div className="flex justify-between text-base font-black pt-2 border-t border-slate-800"><span>Total</span><span className="text-indigo-400">${total.toFixed(2)}</span></div>
                  </div>

                  <button 
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className={`relative max-w-2xl w-full rounded-3xl border overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="relative bg-slate-950">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="object-cover w-full h-full min-h-[300px]" />
            </div>
            <div className="p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{selectedProduct.category}</span>
                  <button onClick={() => setSelectedProduct(null)} className="p-1.5 rounded-xl hover:bg-slate-800"><X size={18} /></button>
                </div>
                <h2 className="text-2xl font-black mb-3">{selectedProduct.name}</h2>
                <div className="flex items-center space-x-1 text-amber-400 font-bold mb-4">
                  <Star size={16} fill="currentColor" />
                  <span>{selectedProduct.rating}</span>
                  <span className={`text-xs font-normal ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>({selectedProduct.reviews} verified reviews)</span>
                </div>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{selectedProduct.description}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-indigo-400">${selectedProduct.price.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className={`relative max-w-lg w-full p-8 rounded-3xl border shadow-2xl z-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            {orderComplete ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="mx-auto h-16 w-16 text-emerald-400 animate-bounce" />
                <h2 className="text-2xl font-black">Order Placed Successfully!</h2>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Thank you for shopping with NEXUS Luxe. Your tracking code has been dispatched to your email.</p>
                <button 
                  onClick={() => { setCart([]); setOrderComplete(false); setIsCheckoutOpen(false); }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold mt-4 shadow-lg shadow-indigo-600/30"
                >
                  Return to Storefront
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h2 className="text-lg font-bold">Secure Checkout</h2>
                  <button onClick={() => setIsCheckoutOpen(false)}><X size={20} /></button>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
                    <input type="text" placeholder="Alex Rivers" className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Shipping Address</label>
                    <input type="text" placeholder="100 Silicon Way, Suite 404" className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} />
                  </div>
                  <div>
                    <label className={`block font-semibold mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Credit Card Details</label>
                    <input type="text" placeholder="•••• •••• •••• ••••" className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} />
                  </div>
                </div>
                <button 
                  onClick={() => setOrderComplete(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Pay ${total.toFixed(2)} & Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST MODAL */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)} />
          <div className={`relative max-w-lg w-full max-h-[80vh] flex flex-col p-6 rounded-3xl border shadow-2xl z-10 ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold flex items-center space-x-2"><Heart size={20} className="text-rose-500" /> <span>My Wishlist ({wishlist.length})</span></h2>
              <button onClick={() => setIsWishlistOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="mx-auto h-12 w-12 text-slate-600 mb-3 opacity-40" />
                  <p className="font-bold">Your wishlist is empty</p>
                </div>
              ) : (
                wishlist.map(item => (
                  <div key={item.id} className={`flex items-center space-x-4 p-4 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-xl" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{item.name}</h4>
                      <p className="text-indigo-400 font-bold text-sm">${item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => addToCart(item)} className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-semibold">Move to Cart</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`border-t py-12 mt-20 ${darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg">N</div>
              <span className="text-lg font-black text-white">NEXUS LUXE</span>
            </div>
            <p className="text-xs">Building cutting-edge frontend web applications with absolute precision and elite performance.</p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Enterprise Security</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1.5"><ShieldCheck size={14} className="text-indigo-400" /> <span>Encrypted Transactions</span></li>
              <li className="flex items-center space-x-1.5"><Truck size={14} className="text-indigo-400" /> <span>Global Express Delivery</span></li>
              <li className="flex items-center space-x-1.5"><RefreshCw size={14} className="text-indigo-400" /> <span>30-Day Risk-Free Returns</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Hardware Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>Mechanical Keyboards</li>
              <li>Spatial Audio Devices</li>
              <li>Ultra-Wide Curved Displays</li>
              <li>Titanium Wearables</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Newsletter</h4>
            <p className="text-xs mb-3">Subscribe for drop alerts and exclusive developer discounts.</p>
            <div className="flex space-x-2">
              <input type="email" placeholder="developer@nexus.io" className={`px-3 py-2 rounded-xl text-xs border w-full ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200'}`} />
              <button className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-bold">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}