import { FormEvent, useEffect, useState } from 'react';

import api from './services/api';

import './styles/app.scss'

type Location = {
  coordinates: [number];
}

type Dev = {
  _id: string;
  name: string;
  bio: string;
  avatar_url: string;
  github_username: string;
  techs: [String];
  location: Location;
}

function App() {
  const [user, setUser] = useState('');
  const [techs, setTechs] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [devs, setDevs] = useState<Dev[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setLatitude(String(latitude));
      setLongitude(String(longitude));
    }, (err) => {
      console.log(err);
    },
    {
      timeout: 30000,
    });

    api.get('devs').then(response => {
      setDevs(response.data);
      // console.log(response.data);
    });
  }, []);
  

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!user || !techs || !latitude || !longitude)
      return;

    const response = await api.post('devs', {
      github_username: user,
      techs,
      latitude, 
      longitude,
    });

    setUser('');
    setTechs('');

    setDevs([...devs, response.data]);
  } 

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>

        <form onSubmit={handleSubmit}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do GitHub</label>
            <input 
              type="text" 
              name="github_username" 
              id="github_username"
              value={user}
              onChange={event => setUser(event.target.value)}
              required 
            />
          </div>

          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input 
              type="text" 
              name="techs" 
              id="techs" 
              value={techs}
              onChange={event => setTechs(event.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input 
                type="number"
                name="latitude" 
                id="latitude" 
                value={latitude}
                onChange={event => setLatitude(event.target.value)}
                required 
              />
            </div>

            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input 
                type="number" 
                name="longitude" 
                id="longitude" 
                value={longitude}
                onChange={event => setLongitude(event.target.value)}
                required 
              />
            </div>
          </div>

          <button type="submit">Salvar</button>
        </form>
      </aside>

      <main>
        <ul>
          { devs.map(dev => {
            return (
              <li key={dev._id} className="dev-item">
                <header>
                  <img src={dev.avatar_url} alt={dev.name} />

                  <div className="user-info">
                    <strong>{dev.name}</strong>
                    
                    <span>{dev.techs.join(', ')}</span>
                  </div>
                </header>

                <p>{dev.bio}</p>

                <a 
                  href={`https://github.com/${dev.github_username}`}
                  target="_blank" 
                  rel="noreferrer"
                >
                  Acessar perfil no GitHub
                </a>
              </li>
            )
          }) }
        </ul>
      </main>
    </div>
  );
}

export default App;
