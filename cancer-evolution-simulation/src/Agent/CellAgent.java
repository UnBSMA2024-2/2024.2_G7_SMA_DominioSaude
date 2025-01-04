package Agent;

import jade.core.Agent;
import jade.core.behaviours.TickerBehaviour;
import java.util.Random;
import java.util.concurrent.ConcurrentLinkedQueue;

import CellTypes.CancerousCell;
import CellTypes.CellType;
import CellTypes.DamagedCell;
import CellTypes.ECellState;
import CellTypes.NormalCell;
import CellTypes.PreCancerousCell;


public class CellAgent extends Agent {
    private static final long serialVersionUID = 1L;
    private int age = 1; // Idade da célula
    private int generation = 0;;
    private CellType celltype = new NormalCell(generation,10);;
    private static int agentCount = 0;
    private static final int MAX_AGENTS = 100; 
    private static final int DAYS_TO_DIVIDE = 4; 
    private static final int DAYS_TO_RUN = 10; 
    private static final ConcurrentLinkedQueue<CellInfo> cellRegistry = new ConcurrentLinkedQueue<>();

    @Override
    protected void setup() {
        final Random random = new Random();

        // Recuperar parâmetros de inicialização
        Object[] args = getArguments();
        if (args != null && args.length > 0) {
            try {
                // Converter o argumento para o enum
                ECellState cellType = ECellState.valueOf(args[0].toString());
                generation = Integer.parseInt(args[1].toString());	
                
                System.out.println("Celltype: "+ cellType);
                
                // Switch com base no enum
                switch (cellType) {
                    case Normal:
                    	celltype = new NormalCell(generation,10);
                        break;
                    case Damaged:
                    	celltype = new DamagedCell(generation,30);
                        break;
                    case PreCancerous:
                        celltype =  new PreCancerousCell(generation,50);
                        break;
                    case Cancerous:
                        celltype = new CancerousCell(generation,90);
                        break;
                    default:
                    	celltype = new NormalCell(generation,10);
                        break;
                }
            } catch (IllegalArgumentException e) {
                System.err.println("Valor inválido para ECellState: " + args[0]);
            }       
        }

        // Adicionar ao registro global
        synchronized (cellRegistry) {
            cellRegistry.add(new CellInfo(getLocalName(), celltype.getGeneration(), celltype));
            agentCount++;
        }

        System.out.println("Agente célula iniciado: " + getLocalName());
        System.out.println("Predisposição genética: " + celltype.getGeneticPredisposition() + "%");
        System.out.println("Status da célula: " + celltype);

        // Adicionar comportamentos
        addBehaviour(new CellDivisionBehaviour(this, random.nextInt(10) * 1000 + 1));
        addBehaviour(new CellApoptoseBehaviour(this, random.nextInt(99) * 1000 + 1));
        addBehaviour(new CellRepairBehaviour(this, random.nextInt(99) * 1000 + 1));
    }

    @Override
    protected void takeDown() {
        synchronized (cellRegistry) {
            cellRegistry.removeIf(cell -> cell.name.equals(getLocalName()));
            agentCount--;
        }
        System.out.println("TakeDown : Agente célula encerrado: " + getLocalName() + ". Total de agentes ativos: " + agentCount);
    }

    private class CellDivisionBehaviour extends TickerBehaviour {
        private static final long serialVersionUID = 1L;

        public CellDivisionBehaviour(Agent a, long interval) {
            super(a, (celltype.getcellState() == ECellState.Cancerous) ? Math.max(interval / 2, 500) : interval);
        }

        @Override
        protected void onTick() {
            try {
                // Verificar se passou um ano (geração * 4 > x tempo)
                if (celltype.getGeneration() * DAYS_TO_DIVIDE > DAYS_TO_RUN) {
                    finishSimulation();
                    return;
                }

                synchronized (cellRegistry) {
                    if (agentCount + 2 > MAX_AGENTS) {
                        System.out.println("Removendo 50% dos agentes!");
                        int cellsToRemove = MAX_AGENTS / 2;
                        for (int i = 0; i < cellsToRemove; i++) {
                            CellInfo oldestCell = cellRegistry.poll();
                            if (oldestCell != null) {
                                jade.wrapper.AgentController agent = getContainerController().getAgent(oldestCell.name);
                                if (agent != null) {
                                    agent.kill();
                                    agentCount--;
                                }
                            }
                        }
                    }
                }

                // Criação de novas células
                if (agentCount + 2 <= MAX_AGENTS) {
                    jade.wrapper.AgentContainer container = getContainerController();

                    // Nomeia os agentes filhos
                    String newAgent1Name = celltype.getGeneration() + 1 + "-" + getLocalName().substring(2) + "0";
                    String newAgent2Name = celltype.getGeneration() + 1 + "-" + getLocalName().substring(2) + "1";

                    // Cria os agentes filhos
                    jade.wrapper.AgentController newAgent1 = container.createNewAgent(
                            newAgent1Name,
                            "Agent.CellAgent",
                            new Object[]{celltype.russianRoulete(),generation+1}
                    );
                    jade.wrapper.AgentController newAgent2 = container.createNewAgent(
                            newAgent2Name,
                            "Agent.CellAgent",
                            new Object[]{celltype.russianRoulete(),generation+1}
                    );

                    // Registra os agentes filhos e incrementa contador
                    synchronized (cellRegistry) {
                        cellRegistry.add(new CellInfo(newAgent1Name, celltype.getGeneration() + 1, celltype));
                        cellRegistry.add(new CellInfo(newAgent2Name, celltype.getGeneration() + 1, celltype));
                        agentCount += 1;
                    }

                    newAgent1.start();
                    newAgent2.start();

                    doDelete();
                } else {
                    System.out.println("Limite de agentes alcançado. Divisão não realizada por " + getLocalName());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private class CellApoptoseBehaviour extends TickerBehaviour {
        private static final long serialVersionUID = 1L;
        private Agent agent;

        public CellApoptoseBehaviour(Agent a, long interval) {
            super(a, interval);
            agent = a;
        }

        @Override
        protected void onTick() {
            if (celltype.apoptose(agent))
                agentCount--;
        }
    }

    private class CellRepairBehaviour extends TickerBehaviour {
        private static final long serialVersionUID = 1L;
        private Agent agent;

        public CellRepairBehaviour(Agent a, long interval) {
            super(a, interval);
            agent = a;
        }

        @Override
        protected void onTick() {
            celltype.repair(agent);
        }
    }

    private static class CellInfo {
        String name;
        int generation;
        CellType celltype;

        CellInfo(String name, int generation, CellType celltype) {
            this.name = name;
            this.generation = generation;
            this.celltype = celltype;
        }
    }

    private void finishSimulation() {
        int normalCount = 0, damagedCount = 0, preCancerousCount = 0, cancerousCount = 0;

        synchronized (cellRegistry) {
            for (CellInfo cell : cellRegistry) {
                if (cell.celltype instanceof NormalCell) normalCount++;
                else if (cell.celltype instanceof DamagedCell) damagedCount++;
                else if (cell.celltype instanceof PreCancerousCell) preCancerousCount++;
                else if (cell.celltype instanceof CancerousCell) cancerousCount++;
            }
        }

        int totalCells = normalCount + damagedCount + preCancerousCount + cancerousCount;
        System.out.println("--------------------------------------------------------------");
        System.out.println("Simulação finalizada. Percentual de células:");
        System.out.println("Normal: " + (normalCount * 100.0 / totalCells) + "%");
        System.out.println("Danificada: " + (damagedCount * 100.0 / totalCells) + "%");
        System.out.println("Pré-Cancer: " + (preCancerousCount * 100.0 / totalCells) + "%");
        System.out.println("Câncer: " + (cancerousCount * 100.0 / totalCells) + "%");
        System.out.println("--------------------------------------------------------------");


        System.exit(0);
    }
}
