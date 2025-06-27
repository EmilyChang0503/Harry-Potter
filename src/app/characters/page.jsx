'use client';
import { useState } from 'react';
import { useCharacters } from '@/app/context/context';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Image from 'next/image';
import {SquareUserRound} from "lucide-react";
import GryffindorImg from '@/assets/Gryffindorcrest.png';
import SlytherinImg from '@/assets/Slytherincrest.png';
import RavenclawImg from '@/assets/Ravenclawcrest.png';
import HufflepuffImg from '@/assets/Hufflepuffcrest.png';
import HogwartsCoaImage from '@/assets/Hogwarts_coa.png';

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

  const [searchName, setSearchName] = useState('');
  const [searchSpecies, setSearchSpecies] = useState('all');
  const [searchGender, setSearchGender] = useState('all');
  const [searchHouse, setSearchHouse] = useState('all');
  const [searchRole, setSearchRole] = useState('all');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');

  const toggleFlip = (name) => {
    setFlippedCards((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  if (loading) return <p className="text-center mt-10">Loading characters...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;

  const uniqueValues = (key) =>
    [...new Set(characters.map((c) => c[key]))].filter((v) => v && v !== '');

  const filtered = characters.filter((c) => {
    const year = c.yearOfBirth ? Number(c.yearOfBirth) : null;
    const age = year ? (new Date().getFullYear() - year) : null;

    return (
      (!searchName || c.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (searchSpecies === 'all' || c.species === searchSpecies) &&
      (searchGender === 'all' || c.gender === searchGender) &&
      (searchHouse === 'all' || c.house === searchHouse) &&
      (searchRole === 'all' || (searchRole === 'Student' && c.hogwartsStudent) || (searchRole === 'Staff' && c.hogwartsStaff)) &&
      (!minAge || (age !== null && (1991 - year) >= Number(minAge))) &&
      (!maxAge || (age !== null && (1991 - year) <= Number(maxAge)))
    );
  });

  const formatDate = (dob) => {
    if (!dob) return '—';
    const [dd, mm, yyyy] = dob.split('-');
    if (!dd || !mm || !yyyy) return dob;
    return `${yyyy}/${mm}/${dd}`;
  };

  const houseImages = {
    Gryffindor: GryffindorImg,
    Slytherin: SlytherinImg,
    Ravenclaw: RavenclawImg,
    Hufflepuff: HufflepuffImg,
    default: HogwartsCoaImage,
  };

  return (
    <section className="bg-gray-300">
      <div className="grid grid-row-1 gap-4 p-8 font-serif">
        <Card className="w-full max-w-5xl mx-auto shadow-lg border border-gray-300 bg-white/80">
          <CardContent className="py-2">
            <div className="flex justify-center">
              <Input
                className="w-[50%]"
                placeholder="Search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div className="flex justify-center flex-wrap gap-4 mt-4">
              <Select value={searchSpecies} onValueChange={setSearchSpecies}>
                <SelectTrigger>
                  <SelectValue placeholder="All Species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Species</SelectItem>
                  {uniqueValues('species').sort((a, b) => a.localeCompare(b)).map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={searchGender} onValueChange={setSearchGender}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  {uniqueValues('gender').sort((a, b) => a.localeCompare(b)).map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={searchHouse} onValueChange={setSearchHouse}>
                <SelectTrigger>
                  <SelectValue placeholder="All Houses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Houses</SelectItem>
                  {uniqueValues('house').sort((a, b) => a.localeCompare(b)).map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex space-x-2">
                <Input
                  className="w-[150px]"
                  placeholder="Min Age"
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                />
                <Input
                  className="w-[150px]"
                  placeholder="Max Age"
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                />
              </div>

              <Select value={searchRole} onValueChange={setSearchRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((char) => {
          const bgClass = houseColors[char.house] || houseColors.default;
          const nameBgClass = nameBgColor[char.house] || nameBgColor.default;
          const isFlipped = flippedCards[char.name];
          const houseImg = houseImages[char.house] || houseImages.default;

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
              <CardContent className="relative w-full h-full">
                
                {/* Front Side */}
                <div
                className="absolute inset-0 flex flex-col transition-transform duration-700"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
                >
                  <div className="absolute left-2 z-10 w-8 h-8">
                    <Image
                    src={houseImg}
                    alt={char.house || 'Hogwarts'}
                    width={32}
                    height={32}
                    className="object-contain"
                    priority={false}
                    />
                  </div>
                  <CardTitle className={`text-lg flex justify-center px-2 py-1 rounded ${nameBgClass} mb-2`}>
                    <p className='drop-shadow-white'>{char.name}</p>
                  </CardTitle>
                  <div className="flex flex-row justify-center w-full h-full">
                    <div className="flex flex-col justify-center w-[60%] h-full">
                    <table
                          className={`text-sm w-full border border-[gold] rounded-lg shadow-[0_0_10px_2px_rgba(255,215,0,0.3)] ${
                            char.house === 'Gryffindor'
                              ? 'bg-[var(--gryffindor-table)]'
                              : char.house === 'Slytherin'
                              ? 'bg-[var(--slytherin-table)]'
                              : char.house === 'Ravenclaw'
                              ? 'bg-[var(--ravenclaw-table)]'
                              : char.house === 'Hufflepuff'
                              ? 'bg-[var(--hufflepuff-table)]'
                              : 'bg-[var(--default-house-table)]'
                          }`}
                        >
                      <tbody className='text-center'>
                      <tr className='border-b border-[gold]'>
                        <td className="border-r border-[gold] text-[gold] drop-shadow-[0_1px_2px_rgba(255,215,0,0.7)]">Species</td>
                        <td className="text-[gold]">{char.species}</td>
                      </tr>
                      <tr className='border-b border-[gold]'>
                        <td className="border-r border-[gold] text-[gold] drop-shadow-[0_1px_2px_rgba(255,215,0,0.7)]">Gender</td>
                        <td className="text-[gold]">{char.gender}</td>
                      </tr>
                      <tr className='border-b border-[gold]'>
                        <td className="border-r border-[gold] text-[gold] drop-shadow-[0_1px_2px_rgba(255,215,0,0.7)]">House</td>
                        <td className="text-[gold]">{char.house || '—'}</td>
                      </tr>
                      <tr className='border-b border-[gold]'>
                        <td className="border-r border-[gold] text-[gold] drop-shadow-[0_1px_2px_rgba(255,215,0,0.7)]">Birth</td>
                        <td className="text-[gold]">{formatDate(char.dateOfBirth)}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-[gold] text-[gold] drop-shadow-[0_1px_2px_rgba(255,215,0,0.7)]">Role</td>
                        <td className="text-[gold]">{char.hogwartsStudent ? 'Student' : char.hogwartsStaff ? 'Staff' : '—'}</td>
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
                </div>
                
                {/* Back Side */}
                <div
                className="absolute inset-0 flex flex-col justify-center items-center text-sm px-4 text-center transition-transform duration-700"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: isFlipped ? 'rotateY(0deg) scaleX(-1)' : 'rotateY(180deg)',
                }}
                >
                <CardTitle className={`text-lg flex justify-center px-2 py-1 rounded ${nameBgClass} mb-2`}>
                  {char.name}
                </CardTitle>
                <h4 className="text-lg font-bold mb-2">Magical Info</h4>
                <p><strong>Wand:</strong> {char.wand?.wood ? `${char.wand.wood}, ${char.wand.core}, ${char.wand.length ?? '?'}` : '—'}</p>
                <hr className="my-2 w-1/2 border-[gold]" />
                <p><strong>Patronus:</strong> {char.patronus || '—'}</p>
                </div>
              </CardContent>
              </Card>
            </div>
            );
        })}
      </div>
    </section>
  );
}
