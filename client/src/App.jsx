import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';

import { IoMdArrowDropdown } from 'react-icons/io';

import Select from 'react-select';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import './App.css';

function App() {
  const API = import.meta.env.VITE_API;

  const [isLoading, setIsLoading] = useState(true);

  // states para controlar qual coluna da tabela detalhes está sendo ordenada
  const [filtroArea, setFiltroArea] = useState(false);
  const [filtroOcupacao, setFiltroOcupacao] = useState(false);

  const [automoveis, setAutomoveis] = useState([]);

  // info de todos automoveis dentro de X area
  const [automoveisArea, setAutomoveisArea] = useState([]);

  const [concessionarias, setConcessionarias] = useState([]);

  // infos das concessionarias tratadas para utilizar no Select de venda
  const [concOpcoes, setConcOpcoes] = useState([]);

  const [clientes, setClientes] = useState([]);

  // infos dos clientes tratados para utilizar no Select de venda
  const [clientesOpcoes, setClientesOpcoes] = useState([]);

  const [areas, setAreas] = useState({});
  // newAreas para melhor manipulação quando ordenada a tabela
  const [newAreas, setNewAreas] = useState({});

  // id de qual area foi clicada
  const [idArea, setIdArea] = useState(0);

  const [vendas, setVendas] = useState([]);

  // exibir o modal
  const [modal, setModal] = useState(false);

  // mudar o que é exibido no modal
  const [venda, setVenda] = useState(false);

  // id do automovel selecionado para venda
  const [idAutoVenda, setIdAutoVenda] = useState(null);

  function formatarMoeda(value) {
    // Intl para formatar para BRL o preço
    let BRreal = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });

    // formatando o input de preço dentro da variável value
    // formatar valor em moeda BRL
    return BRreal.format(value);
  }

  useEffect(() => {
    const getAutomoveis = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/automoveis`);

        // object para facilitar a manipulação
        const object = {};
        res.data.forEach((auto) => {
          object[auto.id] = auto;
        });
        setAutomoveis(object);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };

    const getAreas = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/areas`);

        // object para facilitar a manipulação
        const object = {};
        res.data.forEach((area) => {
          object[area.area] = area;
        });
        setAreas(object);
        setNewAreas(object);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    const getClientes = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/clientes`);

        setClientes(res.data);

        // criando opcoes para o select usado na venda
        let opcoes = [];

        res.data.map((cliente) => {
          opcoes.push({
            value: cliente.id,
            label: cliente.nome,
          });
        });

        setClientesOpcoes(opcoes);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    const getConcessionarias = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/concessionarias`);

        setConcessionarias(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    const getVendas = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/venda`);

        setVendas(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    getAutomoveis();
    getClientes();
    getConcessionarias();
    getAreas();
    getVendas();
  }, []);

  useEffect(() => {
    const getAreaById = async () => {
      try {
        const res = await axios.get(`${API}/areas/${idArea}`);

        setAutomoveisArea(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAreaById();
  }, [idArea]);

  useEffect(() => {
    document.body.style.height = modal ? '100%' : 'auto';
    document.body.style.overflow = modal ? 'hidden' : 'visible';
  }, [modal]);

  useEffect(() => {
    const getConcessionariasByAuto = async () => {
      try {
        const res = await axios.get(`${API}/concessionarias/${idAutoVenda}`);
        // criando opcoes para o select usado na venda
        let opcoes = [];

        res.data.map((conc) => {
          opcoes.push({
            value: conc.id,
            label: conc.nome,
          });
        });

        setConcOpcoes(opcoes);
      } catch (error) {
        console.log(error);
      }
    };

    getConcessionariasByAuto();
  }, [idAutoVenda]);

  async function realizarVenda(event) {
    const body = {
      clienteId: event.target.elements['clienteId'].value,
      concId: event.target.elements['concId'].value,
      autoId: idAutoVenda,
    };

    try {
      await axios.post(`${API}/venda`, body);
      await axios.put(`${API}/automovelqtd`, {
        autoId: idAutoVenda,
        areaId: idArea,
      });
      setModal(false);
      setVenda(false);
      setIdArea(0);
      toast.success('Automóvel vendido com sucesso!');
    } catch (error) {
      console.log(error);
    }
  }

  // customStyles para os Selects
  const customStyles = {
    // option = dropDown menu com as opções
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? '#ffffff' : '#707070',
      backgroundColor: state.isSelected ? '#7814FF' : '#ffffff',
      ':hover': {
        backgroundColor: '#707070',
        color: 'white',
      },
    }),

    // control = input estático (sem foco)
    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: '#ffffff',
      border: '1px solid gray',
      boxShadow: 'none',
      height: '40px',
      width: '100%',
      color: '#000000',
      ':hover': {
        border: '1px solid black',
      },
    }),

    // singleValue = valor selecionado no input
    singleValue: (defaultStyles) => ({
      ...defaultStyles,
    }),
  };

  const OpcaoArea = ({ display }) => {
    if (automoveisArea.length <= 0) {
      return (
        <>
          <h1>Área {idArea}</h1>
          <h3 className="areaVazia">Área está vazia</h3>
        </>
      );
    }
    return (
      <div style={{ display: display }}>
        <h1>Área {idArea}</h1>
        <div>
          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Preço</th>
                <th>Qtd.</th>
              </tr>
            </thead>
            <tbody>
              {automoveisArea &&
                Object.values(automoveisArea).map((auto, index) =>
                  // mostrando paenas automoveis com qtd maior do que 0
                  auto.quantidade > 0 ? (
                    <tr key={index}>
                      <td>{auto.modelo}</td>
                      <td>{formatarMoeda(auto.preco)}</td>
                      <td>{auto.quantidade}</td>
                      <td>
                        <button
                          onClick={() => {
                            setVenda(true), setIdAutoVenda(auto.id);
                          }}
                        >
                          Vender
                        </button>
                      </td>
                    </tr>
                  ) : (
                    ''
                  ),
                )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const OpcaoVenda = ({ display }) => {
    return (
      <div style={{ display: display }}>
        <h1>Venda</h1>
        <form
          method="POST"
          id="form"
          className="labelContaier"
          onSubmit={(event) => {
            event.preventDefault(), realizarVenda(event);
          }}
        >
          <label>Cliente:</label>
          <Select
            name="clienteId"
            className="selectComponent"
            options={clientesOpcoes}
            styles={customStyles}
            placeholder="Selecione..."
            noOptionsMessage={() => 'Nenhum resultado'}
            required
          />

          <label>Concessionaria:</label>
          <Select
            name="concId"
            className="selectComponent"
            options={concOpcoes}
            styles={customStyles}
            placeholder="Selecione..."
            noOptionsMessage={() => 'Nenhum resultado'}
            required
          />
        </form>

        <div className="botoesVenda">
          <button form="form" type="submit">
            Confirmar
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      {/* Popup superior direito  */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
      <div
        className="modalContainer"
        style={{
          display: modal ? 'flex' : 'none',
          top: window.pageYOffset,
        }}
        onClick={() => {
          setModal(false), setVenda(false);
        }}
      >
        {/* stopPropagation para evitar que ao cliclar no modal interno
        todo o modal se feche (parando a propagação do evento clique para o elemento pai) */}
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <OpcaoArea display={venda ? 'none' : 'block'} />
          <OpcaoVenda display={venda ? 'block' : 'none'} />
        </div>
      </div>

      <div className="container">
        <div className="gridContainer">
          {
            // Gerando as 10 áreas
            areas &&
              [...Array(10)].map((_, index) => (
                <div
                  className="area"
                  key={index + 1}
                  style={{
                    gridArea: `area${index + 1}`,
                    backgroundColor:
                      areas[index + 1]?.ocupacao > 0 ? '#0000FF' : '#FFF',
                    color: areas[index + 1]?.ocupacao > 0 ? '#FFF' : '#0000FF',
                  }}
                  onClick={() => {
                    setIdArea(index + 1), setModal(true);
                  }}
                >
                  {index + 1}
                </div>
              ))
          }
        </div>
        <div className="tabelasContainer">
          <div className="tabelaBox">
            <h1>Detalhes</h1>
            <div className="tabelaDetalhes">
              <table>
                <thead>
                  <tr>
                    <th
                      onClick={() => {
                        filtroOcupacao ? setFiltroOcupacao(false) : '';
                        if (filtroArea) {
                          setNewAreas({ ...areas });
                          setFiltroArea(false);
                        } else {
                          setNewAreas({
                            ...Object.values(areas).sort(
                              (a, b) => b.area - a.area,
                            ),
                          });
                          setFiltroArea(true);
                        }
                      }}
                    >
                      Área{' '}
                      <IoMdArrowDropdown
                        size={25}
                        style={{
                          transition: 'all 200ms ease-in-out',
                          rotate: filtroArea ? '0deg' : '180deg',
                        }}
                      />
                    </th>
                    <th
                      onClick={() => {
                        filtroArea ? setFiltroArea(false) : '';
                        if (filtroOcupacao) {
                          setNewAreas({ ...areas });
                          setFiltroOcupacao(false);
                        } else {
                          setNewAreas({
                            ...Object.values(areas).sort(
                              (a, b) => b.ocupacao - a.ocupacao,
                            ),
                          });
                          setFiltroOcupacao(true);
                        }
                      }}
                    >
                      Ocupação{' '}
                      <IoMdArrowDropdown
                        size={25}
                        style={{
                          transition: 'all 200ms ease-in-out',
                          rotate: filtroOcupacao ? '0deg' : '180deg',
                        }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Object.values para o Objeto de Objetos virar um "array"
                 assim sendo possível realizar o map */}
                  {Object.values(newAreas).map((area, index) => (
                    <tr key={index}>
                      <td>{area.area}</td>
                      <td>{area.ocupacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tabelaBox" style={{ marginBlock: '5%' }}>
            <h1>Vendas</h1>
            <div className="tabelaDetalhes">
              <table>
                <thead>
                  <tr>
                    <th>Automóvel</th>
                    <th>Cliente</th>
                    <th>Concessionária</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas &&
                    automoveis &&
                    clientes &&
                    concessionarias &&
                    vendas.map((venda, index) => (
                      <tr key={index}>
                        <td>{automoveis && automoveis[venda.auto]?.modelo}</td>
                        <td>
                          {
                            clientes.find(
                              (cliente) => cliente.id == venda.cliente,
                            )?.nome
                          }
                        </td>
                        <td>
                          {concessionarias
                            .find((conc) => conc.id == venda.conc)
                            ?.nome.replace('concessionária', '')}
                        </td>
                        <td>{new Date(venda.data).toLocaleString('pt-br')}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
