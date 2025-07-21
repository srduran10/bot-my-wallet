import React, { useState, useContext } from 'react';
import { PortfolioContext } from '../context/PortfolioContext';

export default function TransactionForm() {
  const { addPosition } = useContext(PortfolioContext);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!symbol || !quantity || !price) return;

    const nuevaPosicion = {
      symbol: symbol.toLowerCase(),
      quantity: parseFloat(quantity),
      avgPrice: parseFloat(price)
    };

    console.log('Formulario enviado. Posición creada:', nuevaPosicion);

    addPosition(nuevaPosicion);

    setSymbol('');
    setQuantity('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
      <h2>📝 Simular compra</h2>
      <input
        type="text"
        placeholder="Símbolo (ej. bitcoin)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Cantidad (ej. 0.25)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio de compra (ej. 29650)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button type="submit" style={{ marginTop: '0.5rem' }}>
        Agregar al portafolio
      </button>
    </form>
  );
}
