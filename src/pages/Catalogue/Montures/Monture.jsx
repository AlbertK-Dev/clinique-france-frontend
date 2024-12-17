/* eslint-disable consistent-return */
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription, 
  Button, 
  Spinner, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  IconButton, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Input, 
  Select 
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'; // Icône pour le bouton d'actions
import { LuRefreshCcw } from "react-icons/lu";

// Création du contexte
const MontureContext = createContext();

// Fonction pour vérifier si le contexte est utilisé correctement
const useMontureContext = () => {
  const context = useContext(MontureContext);
  if (!context) {
    throw new Error('useMontureContext must be used within a MontureZone');
  }
  return context;
};

// Composant MontureState pour gérer les états (error, success, loading)
function MontureState({ process, retryFunction, setProcess }) {
  const { error, success, loading } = process;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setProcess(prev => ({...prev, success:null}))
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, process]);

  return (
    <div>
      {loading && <Spinner />}
      {error && (
        <Alert status="error" variant="left-accent" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Erreur!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={retryFunction} ml={4} colorScheme="red">
            Réessayer
          </Button>
        </Alert>
      )}
      {success && (
        <Alert status="success" variant="left-accent" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Succès!</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}


// Fonction pour mettre en gras les caractères recherchés
const highlightSearchTerm = (text, term) => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.split(regex).map((part, index) => 
    part.toLowerCase() === term.toLowerCase() ? <strong style={{color:"green"}} key={index}>{part}</strong> : part
  );
};


// Composant MontureZone pour charger les montures et fournir le contexte
function MontureZone({ api, actions, children, r }) {
  const [montures, setMontures] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [process, setProcess] = useState({ error: null, success: null, loading: false });



  // Fonction pour charger les montures depuis l'API
  const loadMontures = async () => {
    try {
      setProcess({ ...process, loading: true });
      const data = await api.getMontures(); // Appel à l'API pour récupérer les montures
      setMontures(data); // Mise à jour de l'état avec les montures récupérées
      setProcess({ error: null, success: 'Montures chargées avec succès', loading: false });
    } catch (error) {
      setProcess({ error: 'Erreur lors du chargement des montures', success: null, loading: false });
    }
  };

  const refresh = () => {
    loadMontures();
  };

  useEffect(() => {
    loadMontures(); // Appel à l'API pour charger les montures au montage du composant
  }, [r]);

    // Filtrer et ordonner les montures
    const filteredMontures = useMemo(() => {
      let result = montures || [];



      
      // Recherche dans marque et modèle
      result = result?.filter((monture) =>
        monture?.brand?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        monture?.model?.toLowerCase().includes(searchTerm?.toLowerCase())
      );
  
      // Ordre alphabétique si nécessaire
      if (filter === 'marque' || filter === '') {
        result = result.sort((a, b) => 
          order === 'asc' ? a.brand.localeCompare(b.brand) : b.brand.localeCompare(a.brand)
        );
      } else if (filter === 'model') {
        result = result.sort((a, b) =>
          order === 'asc' ? a.model.localeCompare(b.model) : b.model.localeCompare(a.model)
        );
      }  else if (filter === 'quantity') {// Filtrer par marque, modèle, ou date
        result = result.sort((a, b) => 
          order === 'asc' ? Number(a.quantity) - Number(b.quantity) : Number(b.quantity) - Number(a.quantity)
        );
      } else if (filter === 'vendu') {
        result = result.filter((monture) => monture.isInStock === false);
      } else if (filter === 'createdAt') {
        result = result.sort((a, b) => 
          order === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (filter === 'updatedAt') {
        result = result.sort((a, b) => 
          order === 'asc' ? new Date(a.updatedAt) - new Date(b.updatedAt) : new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      }else if (filter === 'Homme') {
        result = result.filter((monture) => monture?.genre === "Homme");
      }else if (filter === 'Femme') {
        result = result.filter((monture) => monture?.genre === "Femme");
      }
  
  
      return result;
    }, [montures, filter, searchTerm, order]);
  

  // Pagination
  const paginatedMontures = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMontures.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMontures, currentPage, itemsPerPage]);

  // Fournir les valeurs contextuelles
  const contextValue = useMemo(
    () => ({
      montures: paginatedMontures,
      totalMontures: filteredMontures.length,
      filter,
      setFilter,
      searchTerm,
      setSearchTerm,
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
      order,
      setOrder,
      process,
      setProcess,
      actions, 
      refresh
    }),
    [
      paginatedMontures,
      filteredMontures.length,
      filter,
      searchTerm,
      currentPage,
      itemsPerPage,
      order,
      process,
      actions, 
    ]
  );

  return (
    <MontureContext.Provider value={contextValue}>
      <MontureState process={process} retryFunction={loadMontures} setProcess={setProcess} /> {/* Gestion des états */}
      {children}
    </MontureContext.Provider>
  );
}

function MontureList() {
  const { montures, actions, searchTerm } = useMontureContext();

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Marque</Th>
          <Th>Modèle</Th>
          <Th>Genre</Th>
          <Th>Quantité</Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {montures.map((monture) => (
          <Tr key={monture._id}>
            <Td>{highlightSearchTerm(monture.brand, searchTerm)}</Td>
            <Td>{highlightSearchTerm(monture.model, searchTerm)}</Td>
            <Td >{monture?.genre}</Td>
            <Td >{monture?.quantity }</Td>
            <Td>
              <Menu>
                <MenuButton as={IconButton} icon={<ChevronDownIcon />} />
                <MenuList>
                  {actions.map((action, index) => (
                    <MenuItem key={index} onClick={() => action.action(monture)}>
                      {action.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

// Exemple de pagination MonturePagination
function MonturePagination() {
  const { currentPage, setCurrentPage, totalMontures, itemsPerPage } = useMontureContext();

  const totalPages = Math.ceil(totalMontures / itemsPerPage);

  const [show, setShow] = useState(true)

  useEffect(()=>{
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
    if (totalMontures <= itemsPerPage) {
      setShow(false);
    }else{
      setShow(true)
    }

  },[totalMontures])

  return (
    show && <div>
      <Button onClick={() => setCurrentPage(currentPage - 1)} isDisabled={currentPage === 1}>
        Précédent
      </Button>
      <span>
        Page {currentPage} sur {totalPages}
      </span>
      <Button onClick={() => setCurrentPage(currentPage + 1)} isDisabled={currentPage === totalPages}>
        Suivant
      </Button>
    </div>
  );
}

function Refresher({toggleState}) {
  const {refresh} = useMontureContext();
  useEffect(()=>{
    refresh()
  },[toggleState])
  return null
  
}

// Composant MontureSearch
function MontureSearch() {
  const { searchTerm, setSearchTerm } = useMontureContext();

  return (
    <Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Rechercher une monture..."
    />
  );
}

// Composant MontureFilter
function MontureFilter() {
  const { filter, setFilter } = useMontureContext();

  return (
    <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
      <option value="">Tous</option>
      <option value="Homme">Hommes</option>
      <option value="Femme">Femmes</option>
      <option value="marque">Par marque</option>
      <option value="quantity">Quantité</option>
      <option value="vendu">Vendu</option>
      <option value="createdAt">Date de création</option>
      <option value="updatedAt">Date de mise à jour</option>
    </Select>
  );
}

// Composant FilterOrder pour gérer l'ordre croissant ou décroissant
function FilterOrder() {
  const { order, setOrder } = useContext(MontureContext);
  return (
    <Select value={order} onChange={(e) => setOrder(e.target.value)}>
      <option value="asc">Croissant</option>
      <option value="desc">Décroissant</option>
    </Select>
  );
}


// Composant MontureNumber qui affiche le nombre de montures affichées
function MontureNumber() {
  const { totalMontures } = useMontureContext();
  return <div>{totalMontures} montures trouvées</div>;
}
// Composant MontureRefresh qui fait le rafraichissement
function MontureRefresh() {
  const { refresh } = useMontureContext();
  return <IconButton onClick={refresh} aria-label='Actualiser'>
    <LuRefreshCcw />
  </IconButton>
}

// Composant ActionWithShowedMonture pour effectuer une action avec les montures affichées
function ActionWithShowedMonture({ onClick, label }) {
  const { montures } = useMontureContext();
  return (
    <Button colorScheme='blue' minW={200} onClick={() => onClick(montures)}>{label}</Button>
  );
}

// Export des composants
export {
  MontureZone,
  MontureList,
  MonturePagination,
  MontureSearch,
  MontureFilter,
  FilterOrder,
  MontureNumber,
  ActionWithShowedMonture,
  MontureState,
  MontureRefresh,
  Refresher
};
