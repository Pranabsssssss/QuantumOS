"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<{ eq: string, res: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showHistory) scrollToBottom();
  }, [history, showHistory]);

  const handleNum = (num: string) => {
    setDisplay(prev => {
      if (prev === '0' || prev === 'Error') return num;
      return prev + num;
    });
  };

  const handleOp = (op: string) => {
    if (display === 'Error') return;
    setDisplay(prev => prev + op);
  };

  const handleScientific = (fn: string) => {
    if (display === 'Error') return;
    try {
      let val = parseFloat(display);
      let res: number;
      switch (fn) {
        case 'sin': res = Math.sin(val * Math.PI / 180); break;
        case 'cos': res = Math.cos(val * Math.PI / 180); break;
        case 'tan': res = Math.tan(val * Math.PI / 180); break;
        case 'sqrt': res = Math.sqrt(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'exp': res = Math.exp(val); break;
        case 'pow': setDisplay(prev => prev + '**'); return;
        default: return;
      }
      const finalRes = Number(res.toFixed(8)).toString();
      setHistory(prev => [...prev, { eq: `${fn}(${display})`, res: finalRes }]);
      setDisplay(finalRes);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const calculate = () => {
    if (!display || display === 'Error') return;
    try {
      // Replace symbols for eval
      const sanitizedEq = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
      
      const result = new Function('return ' + sanitizedEq)();
      const finalRes = Number(Number(result).toFixed(8)).toString();
      
      setHistory(prev => [...prev, { eq: display, res: finalRes }]);
      setDisplay(finalRes);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleDelete = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      const key = e.key;
      if (/[0-9]/.test(key)) handleNum(key);
      if (['+', '-', '*', '/'].includes(key)) handleOp(key === '*' ? '×' : key === '/' ? '÷' : key);
      if (key === 'Enter' || key === '=') calculate();
      if (key === 'Escape') handleClear();
      if (key === 'Backspace') handleDelete();
      if (key === '.') handleNum('.');
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]);

  const Button = ({ children, onClick, className, variant = 'default' }: any) => (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        "h-12 rounded-xl flex items-center justify-center text-lg font-medium transition-all duration-200",
        variant === 'op' && "bg-accent/10 text-accent hover:bg-accent/20",
        variant === 'action' && "bg-white/5 text-white/90 hover:bg-white/10",
        variant === 'equal' && "bg-accent text-black font-bold shadow-[0_0_20px_rgba(var(--accent-color),0.3)] hover:brightness-110",
        variant === 'sci' && "bg-white/5 text-accent/80 text-sm",
        !variant || variant === 'default' && "bg-white/5 text-white hover:bg-white/10",
        className
      )}
    >
      {children}
    </motion.button>
  );

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex overflow-hidden font-sans text-white relative">
      {/* Sidebar: History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full border-r border-white/10 bg-black/40 flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-widest text-white/50">History</span>
              <button onClick={() => setHistory([])} className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {history.length === 0 && <div className="text-white/20 text-xs text-center mt-10 italic">No history yet</div>}
              {history.map((item, i) => (
                <div key={i} className="flex flex-col items-end gap-1 group cursor-pointer" onClick={() => setDisplay(item.res)}>
                  <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{item.eq} =</div>
                  <div className="text-base font-bold text-accent">{item.res}</div>
                </div>
              ))}
              <div ref={historyEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Calculator */}
      <div className="flex-1 flex flex-col relative">
        {/* Top bar controls */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={clsx("p-2 rounded-xl transition-all", showHistory ? "bg-accent text-black" : "bg-white/5 text-white/50 hover:bg-white/10")}
          >
            <History size={18} />
          </button>
          <button 
            onClick={() => setIsScientific(!isScientific)}
            className={clsx("px-3 py-1 rounded-xl text-xs font-bold transition-all", isScientific ? "bg-accent text-black" : "bg-white/5 text-white/50 hover:bg-white/10")}
          >
            SCI
          </button>
        </div>

        {/* Display */}
        <div className="h-40 flex flex-col items-end justify-end p-8 gap-2 bg-gradient-to-b from-transparent to-white/[0.02]">
          <div className="text-sm text-white/30 h-6 overflow-hidden truncate w-full text-right font-mono">
            {equation}
          </div>
          <motion.div 
            key={display}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-light tracking-tighter truncate w-full text-right font-mono"
          >
            {display}
          </motion.div>
        </div>

        {/* Keypad */}
        <div className="flex-1 p-6 grid grid-cols-4 gap-2">
          {/* Scientific Row */}
          {isScientific && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-4 grid grid-cols-4 gap-2 mb-2"
            >
              <Button variant="sci" onClick={() => handleScientific('sin')}>sin</Button>
              <Button variant="sci" onClick={() => handleScientific('cos')}>cos</Button>
              <Button variant="sci" onClick={() => handleScientific('tan')}>tan</Button>
              <Button variant="sci" onClick={() => handleScientific('sqrt')}>√</Button>
              <Button variant="sci" onClick={() => handleScientific('log')}>log</Button>
              <Button variant="sci" onClick={() => handleScientific('ln')}>ln</Button>
              <Button variant="sci" onClick={() => setDisplay(Math.PI.toFixed(8))}>π</Button>
              <Button variant="sci" onClick={() => handleScientific('pow')}>xʸ</Button>
            </motion.div>
          )}

          <Button variant="action" onClick={handleClear} className="text-red-400">AC</Button>
          <Button variant="action" onClick={handleDelete}>DEL</Button>
          <Button variant="action" onClick={() => handleOp('%')}>%</Button>
          <Button variant="op" onClick={() => handleOp('÷')}>÷</Button>
          
          <Button onClick={() => handleNum('7')}>7</Button>
          <Button onClick={() => handleNum('8')}>8</Button>
          <Button onClick={() => handleNum('9')}>9</Button>
          <Button variant="op" onClick={() => handleOp('×')}>×</Button>
          
          <Button onClick={() => handleNum('4')}>4</Button>
          <Button onClick={() => handleNum('5')}>5</Button>
          <Button onClick={() => handleNum('6')}>6</Button>
          <Button variant="op" onClick={() => handleOp('-')}>-</Button>
          
          <Button onClick={() => handleNum('1')}>1</Button>
          <Button onClick={() => handleNum('2')}>2</Button>
          <Button onClick={() => handleNum('3')}>3</Button>
          <Button variant="op" onClick={() => handleOp('+')}>+</Button>
          
          <Button className="col-span-2" onClick={() => handleNum('0')}>0</Button>
          <Button onClick={() => handleNum('.')}>.</Button>
          <Button variant="equal" onClick={calculate}>=</Button>
        </div>
      </div>
    </div>
  );
};
