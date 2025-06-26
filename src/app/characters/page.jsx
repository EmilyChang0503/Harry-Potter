'use client';
import { useState } from 'react';
import { useCharacters } from '@/app/context/context';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {SquareUserRound} from "lucide-react";

const houseColors = {
  Gryffindor: 'bg-[var(--gryffindor)]',
  Slytherin: 'bg-[var(--slytherin)]',
  Ravenclaw: 'bg-[var(--ravenclaw)]',
  Hufflepuff: 'bg-[var(--hufflepuff)]',
  default: 'bg-[var(--default-house)]',
};

const nameBgColor = {
  Gryffindor: 'bg-[var(--gryffindor-deep)]',
  Slytherin: 'bg-[var(--slytherin-deep)]',
  Ravenclaw: 'bg-[var(--ravenclaw-deep)]',
  Hufflepuff: 'bg-[var(--hufflepuff-deep)]',
  default: 'bg-[var(--default-house-deep)]',
};

export default function CharacterCardsPage() {
  const { characters, loading, error } = useCharacters();
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (name) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  if (loading) return <p className="text-center mt-10">Loading characters...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  return (
    <section className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {characters.map((char) => {
        const bgClass = houseColors[char.house] || houseColors.default;
        const nameBgClass = nameBgColor[char.house] || nameBgColor.default;
        const isFlipped = flippedCards[char.name];

        const formatDate = (dob) => {
          if (!dob) return '—';
          const [dd, mm, yyyy] = dob.split('-');
          if (!dd || !mm || !yyyy) return dob;
          return `${yyyy}/${mm}/${dd}`;
        };

        return (
          <div
            key={char.id}
            className="[perspective:1000px] hover:scale-[1.03] transition-transform duration-300"
            onClick={() => toggleFlip(char.name)}
          >
            <Card
              className={`flex flex-col border ${bgClass} shadow-lg overflow-hidden h-56 text-white font-serif p-5 transition-transform duration-700 [transform-style:preserve-3d] 
              ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
            >
            <CardTitle className={`text-lg flex justify-center px-2 py-1 rounded ${nameBgClass}`}>
              {char.name}
            </CardTitle>
            <CardContent className="relative w-full h-full">
            {/* Front Side */}
            <div
                className="absolute inset-0 flex transition-transform duration-700"
                style={{
                backfaceVisibility: 'hidden',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                <div className="flex flex-col justify-center w-[60%] h-full">
                <table className="text-sm w-full border border-white">
                    <tbody className='text-center'>
                    <tr className='border border-white'>
                        <td className="font-semibold pr-2 border border-white">Species</td>
                        <td>{char.species}</td>
                    </tr>
                    <tr className='border border-white'>
                        <td className="font-semibold pr-2 border border-white">Gender</td>
                        <td>{char.gender}</td>
                    </tr>
                    <tr className='border border-white'>
                        <td className="font-semibold pr-2 border border-white">House</td>
                        <td>{char.house || '—'}</td>
                    </tr>
                    <tr className='border border-white'>
                        <td className="font-semibold pr-2 border border-white">Birth</td>
                        <td>{formatDate(char.dateOfBirth)}</td>
                    </tr>
                    <tr className='border border-white'>
                        <td className="font-semibold pr-2 border border-white">Role</td>
                        <td>{char.hogwartsStudent ? 'Student' : char.hogwartsStaff ? 'Staff' : '—'}</td>
                    </tr>
                    </tbody>
                </table>
                </div>
                {char.image ? (
                <div className="relative w-[40%] h-full flex-shrink-0 flex items-center justify-center">
                    <div className="relative w-24 h-32">
                    <Image
                        src={char.image}
                        alt={char.name}
                        fill
                        className="object-cover rounded"
                    />
                    </div>
                </div>
                ) : (
                <div className="relative w-[40%] h-full flex-shrink-0 flex items-center justify-center">
                    <div className="relative w-24 h-32 flex items-center justify-center">
                        <SquareUserRound size={30}/>
                    </div>
                </div>
                )}
            </div>
            {/* Back Side */}
              <div
                className="absolute inset-0 flex flex-col justify-center items-center text-sm px-4 text-center transition-transform duration-700"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)',
                }}
              >
                <h4 className="text-lg font-bold mb-2">Magical Info</h4>
                <p><strong>Wand:</strong> {char.wand?.wood ? `${char.wand.wood}, ${char.wand.core}, ${char.wand.length ?? '?'}` : '—'}</p>
                <hr className="my-2 w-1/2" />
                <p><strong>Patronus:</strong> {char.patronus || '—'}</p>
              </div>
            </CardContent>
            </Card>
          </div>
        );
      })}
    </section>
  );
}
