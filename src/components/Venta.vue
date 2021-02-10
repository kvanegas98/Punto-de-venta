<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Ventas</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="verNuevo == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
          v-if="verNuevo == 0"
          @click="listar()"
          color="primary"
          dark
          class="mb-2"
          >Buscar</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          v-if="verNuevo == 0"
          @click="mostrarNuevo"
          color="primary"
          dark
          class="mb-2"
          >Nuevo</v-btn
        >
        <v-dialog v-model="verArticulos" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un artículo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      append-icon="search"
                      class="text-xs-center"
                      v-model="texto"
                      label="Ingrese artículo a buscar"
                      @keyup="listarArticulo()"
                    >
                    </v-text-field>
                    <template>
                      <v-data-table
                        :headers="cabeceraArticulos"
                        :items="articulos"
                        class="elevation-1"
                      >
                        <template slot="items" slot-scope="props">
                          <td class="justify-center layout px-0">
                            <v-icon
                              small
                              class="mr-2"
                              @click="agregarDetalle(props.item)"
                            >
                              add
                            </v-icon>
                          </td>
                          <td>{{ props.item.nombre }}</td>
                          <td>{{ props.item.categoria }}</td>
                          <td>{{ props.item.descripcion }}</td>
                          <td>{{ props.item.stock }}</td>
                          <td>{{ props.item.precio_venta }}</td>
                        </template>
                        <template slot="no-data">
                          <h3>No hay artículos para mostrar.</h3>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="ocultarArticulos()" color="blue darken" flat>
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1"
              >¿Activar Item?</v-card-title
            >
            <v-card-title class="headline" v-if="adAccion == 2"
              >¿Anular Venta?</v-card-title
            >
            <v-card-text>
              Estás a punto de
              <span v-if="adAccion == 1">Activar </span>
              <span v-if="adAccion == 2">Anular </span>
              el ítem {{ adNombre }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                flat="flat"
                @click="activarDesactivarCerrar"
              >
                Cancelar
              </v-btn>
              <v-btn
                v-if="adAccion == 1"
                color="orange darken-4"
                flat="flat"
                @click="activar"
              >
                Activar
              </v-btn>
              <v-btn
                v-if="adAccion == 2"
                color="orange darken-4"
                flat="flat"
                @click="desactivar"
              >
                Anular
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="comprobanteModal" max-width="500px">
          <v-card>
            <v-card-text>
             <!--  <v-btn @click="crearPDF()">
                <v-icon>print</v-icon>
              </v-btn> -->
              <v-btn @click="imprimir()">
                <v-icon>print</v-icon>
              </v-btn>
              <!-- <div id="factura">
                <header> -->
                  <!-- <div id="logo"> -->
                    <!-- <img id="imagen" src="@/assets/logo.png" alt="Gema Moda" /> -->
                 <!--  </div> -->
                  <!-- <div id="datos">
                    <p id="encabezado">
                      <b>GEMA MODA</b><br />Ofrecemos ropa para damas,
                      caballeros y niños a la mejor calidad, con los mejores
                      precios del mercado, al por mayor y detalle
                      <br />Telefono:7714-2193 / 8967-2690<br />Direccion: Del
                      banpro de ciudad Jardín 3c. al lago, 2c. abajo
                    </p>
                  </div> -->
                  <!-- <div id="fact"> -->
                   <!--  <h2 id="nombreFactura">Factura</h2> -->
                   <!--  <p id="datosFactura">
                      NO. {{ num_factura }}<br />
                      {{ tipo_comprobante }} <br />
                      {{ fecha_hora | moment("DD/MM/YYYY") }}
                    </p>
                  </div>
                </header>
                <br />
                <section>
                  <div>
                    <table id="facliente">
                      <tbody>
                        <tr>
                          <td id="cliente">
                            <strong>Sr(a). {{ cliente }}</strong
                            ><br />
                            <strong>Documento:</strong> {{ num_documento
                            }}<br />
                            <strong>Dirección:</strong> {{ direccion }}<br />
                            <strong>Teléfono:</strong> {{ telefono }}<br />
                            <strong>Email:</strong> {{ email }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
                <br />
                <section>
                  <div>
                    <table id="facarticulo">
                      <thead>
                        <tr id="fa">
                          <th>CANT</th>
                          <th>DESCRIPCION</th>
                          <th>PRECIO UNIT</th>
                          <th>DESC.</th>
                          <th>PRECIO TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="det in detalles" :key="det.iddetalle_venta">
                          <td style="text-align: center">{{ det.cantidad }}</td>
                          <td id="detalles">{{ det.articulo }}</td>
                          <td id="detalles">{{ det.precio | currency }}</td>
                          <td id="detalles">{{ det.descuento | currency }}</td>
                          <td id="detalles">
                            {{
                              (
                                det.cantidad * det.precio -
                                det.descuento
                              ).toFixed(2) | currency
                            }}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <br />
                        <br />
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">SUBTOTAL</th>
                          <th style="text-align: right">
                            {{
                              (totalParcial = calcularTotal.toFixed(2))
                                | currency
                            }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">Envio</th>
                          <th style="text-align: right">
                            {{ (totalImpuesto = impuesto) | currency }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          <th style="text-align: right">TOTAL</th>
                          <th style="text-align: right">
                            {{
                              (total =
                                parseFloat(totalImpuesto) +
                                parseFloat(totalParcial)).toFixed(2) | currency
                            }}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
                <br />
                <br />
                <footer>
                  <div id="gracias">
                    <p><b>Gracias por su compra!</b></p>
                  </div>
                </footer>
              </div> -->
             <div id="ticket">
               <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css" media="print">
               <!-- <h2 class="texto">Gema Moda</h2>
               <h4 class="texto">La Concha</h4> -->
                <div id="logo"> 
                    <img style="text-align:center;
  margin-top: 0px;
  margin-bottom: 0px;" id="imagen" src="@/assets/logo.png" alt="Gema Moda" />
                  </div>
              
      
            <!-- <img
                src="https://yt3.ggpht.com/-3BKTe8YFlbA/AAAAAAAAAAI/AAAAAAAAAAA/ad0jqQ4IkGE/s900-c-k-no-mo-rj-c0xffffff/photo.jpg"
                alt="Logotipo"> -->
                 <!--  <p id="centrado" class="centrado">
                      NO. {{ num_factura }}<br />
                      {{ tipo_comprobante }} <br />
                      {{ fecha_hora | moment("DD/MM/YYYY") }}
                    </p> -->
                    <div >

                    <!-- <strong> NO. {{ num_factura }}</strong>
                    <br>
                    <strong> FACTURA: {{ tipo_comprobante }}</strong>
                    <br>
                    <strong>{{ fecha_hora | moment("DD/MM/YYYY") }}</strong>
                    <strong style="margin-left: 10px">{{ fecha_hora | moment("LT") }}</strong>
                    <br> -->
                    <h5 style="font-weight: bold; font-size:25px;">NO. {{ num_factura }}</h5>
                    <h5 style="font-weight: bold; font-size:25px;">FACTURA: {{ tipo_comprobante }}</h5>
                    <h5 style="font-weight: bold; font-size:25px;">FECHA: {{ fecha_hora | moment("DD/MM/YYYY") }} |  {{ fecha_hora | moment("LT") }}  </h5>
                    <!-- <h5 style="margin-left: 10px">{{ fecha_hora | moment("LT") }}</h5> -->
                    
                    <div style="font-weight: bold; font-size:25px; " class="okas">-------------------------------------------------</div>
                    </div>
                    <br>
                    <div>
         <!-- <p class = "flow-text">
             <strong>Sr(a). {{ cliente }}</strong
                            ><br />
                            <strong>Documento:</strong> {{ num_documento
                            }}<br />
                            <strong>Dirección:</strong> {{ direccion }}<br />
                            <strong>Teléfono:</strong> {{ telefono }}<br />
                            <strong>Email:</strong> {{ email }}
         </p> -->
         <div class = "flow-text">
             
                            <h5 style="font-weight: bold; font-size:20px;">Sr(a): {{ cliente }}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Documento: {{num_documento}}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Dirección: {{direccion}}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Telefono: {{telefono}}</h5>
                            <h5 style="font-weight: bold; font-size:20px;">Email: {{email}}</h5>
                      
         </div>
      </div>	
      <div class="okas">-----------------------------------------------------------------------------------</div>

                   <!--  <strong class="right-align">{{ fecha_hora | moment("LT") }}</strong>
                    <br> -->

                   
                          <!--   <strong>Sr(a). {{ cliente }}</strong
                            ><br />
                            <strong>Documento:</strong> {{ num_documento
                            }}<br />
                            <strong>Dirección:</strong> {{ direccion }}<br />
                            <strong>Teléfono:</strong> {{ telefono }}<br />
                            <strong>Email:</strong> {{ email }}
                        
                <br><br> -->
            <table>
                <thead>
                    <tr>
                        <th style="font-weight: bold; font-size:20px;" class="cantidad">Cantidad</th>
                        <th style="font-weight: bold; font-size:20px;" class="producto">Producto</th>
                        <th style="font-weight: bold; font-size:20px;" class="precio">Precio</th>
                        <th style="font-weight: bold; font-size:20px;" class="precio">Descuento</th>
                        <th style="font-weight: bold; font-size:20px;" class="precio">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                       <tr v-for="det in detalles" :key="det.iddetalle_venta">
                          <td  class="cantidad" style="font-weight: bold; font-size:18px;">{{ det.cantidad }}</td>
                          <td style="font-weight: bold; font-size:18px;"  id="producto" class="producto" >{{ det.articulo }}</td>
                          <td style="font-weight: bold; font-size:18px;" id="precio" class="precio">{{ det.precio.toFixed(2) }}</td>
                          <td style="font-weight: bold; font-size:18px; text-align:center;" id="precio">{{ det.descuento  }}</td>
                          <td style="font-weight: bold; font-size:18px;" id="detalles" class="precio">
                            {{
                              (
                                det.cantidad * det.precio -
                                det.descuento
                              ).toFixed(2) 
                            }}
                          </td>
                        </tr>
                        
                </tbody>
                <tfoot>
                        <br />
                        <br />
                        <tr>
                          <th></th>
                          <th></th>
                           <th></th>
                          <th style="font-weight: bold; font-size:20px;">SUBTOTAL:</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            {{
                              (totalParcial = calcularTotal.toFixed(2))
                                | currency
                            }}
                          </th>
                        </tr>
                        <tr>
                          <th>
                          </th>
                          <th>
                          </th>
                           <th></th>
                          <th style="font-weight: bold; font-size:20px;">ENVIO:</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            {{ (totalImpuesto = impuesto) | currency }}
                          </th>
                        </tr>
                        <tr>
                          <th></th>
                           <th></th>
                            <th></th>
                          <th style="font-weight: bold; font-size:20px;">TOTAL</th>
                          <th style="font-weight: bold; font-size:20px;" class="producto">
                            {{
                              (total =
                                parseFloat(totalImpuesto) +
                                parseFloat(totalParcial)).toFixed(2) | currency
                            }}
                          </th>
                        </tr>
                  
                      </tfoot>
            </table>
            <br>
            <strong style="font-weight: bold; font-size:20px;">Atendido por: {{ vendedor }}</strong>
            <br><br>
            <div class="div" style="text-align: center">
                <strong style="font-weight: bold; font-size:30px;" class="text-bold centrado">¡GRACIAS POR SU COMPRA!</strong>
            </div>
            
        </div>
              <v-btn @click="ocultarComprobante" color="blue darken-1" flat
                >Cancelar</v-btn
              >
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ventas"
        :search="search"
        class="elevation-1"
        v-if="verNuevo == 0">
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="verDetalles(props.item)">
              tab
            </v-icon>
            <v-icon small class="mr-2" @click="mostrarComprobante(props.item)">
              print
            </v-icon>
            <template v-if="props.item.estado == 'Aceptado'">
              <v-icon small @click="activarDesactivarMostrar(2, props.item)">
                block
              </v-icon>
            </template>
          </td>
          <td>{{ props.item.idventa }}</td>
          <td>{{ props.item.usuario }}</td>
          <td>{{ props.item.cliente }}</td>
          <td>{{ props.item.tipo_comprobante }}</td>
          <td>{{ props.item.fecha_hora | moment("DD/MM/YYYY") }}</td>
          <td>{{ props.item.impuesto | currency }}</td>
          <td>{{ props.item.total | currency }}</td>
          <td>
            <div v-if="props.item.estado == 'Aceptado'">
              <span class="blue--text">Aceptado</span>
            </div>
            <div v-else>
              <span class="red--text">{{ props.item.estado }}</span>
            </div>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
              v-model="tipo_comprobante"
              :items="comprobantes"
              label="Tipo Factura"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select v-model="idusuario" :items="vendedores" label="Vendedor" autocomplete="on">
            </v-select>
          </v-flex>

      
            <v-flex xs12 sm8 md8 lg8 xl8>
            <v-select v-model="idcliente" :items="clientes" label="Cliente" autocomplete="on">
            </v-select>
          </v-flex>
        
        
         <!--  <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field type="number" v-model="impuesto" label="Envio">
            </v-text-field>
          </v-flex> -->

          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field type="number" v-model="impuesto" label="Envio">
            </v-text-field>
          </v-flex>
           
          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-text-field
              @keyup.enter="buscarCodigo()"
              v-model="codigo"
              label="Código"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn @click="mostrarArticulos()" small fab dark color="teal">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-if="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-data-table
              :headers="cabeceraDetalles"
              :items="detalles"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    @click="eliminarDetalle(detalles, props.item)"
                  >
                    delete
                  </v-icon>
                </td>
                <td>{{ props.item.articulo }}</td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="props.item.cantidad"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    disabled="disabled"
                    v-model="props.item.precio"
                  ></v-text-field>
                </td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="props.item.descuento"
                  ></v-text-field>
                </td>
                <td>
                  $
                  {{
                    props.item.cantidad * props.item.precio -
                    props.item.descuento
                  }}
                </td>
              </template>
              <template slot="no-data">
                <h3>No hay artículos agregados al detalle.</h3>
              </template>
            </v-data-table>
            <v-flex class="text-xs-right">
              <strong>SUbtotal: </strong>
              {{ (totalParcial = calcularTotal.toFixed(2)) | currency }}
            </v-flex>
            <!-- <v-flex class="text-xs-right">
              <strong>Envio: </strong>
              {{ (totalImpuesto = impuesto | currency) }}
            </v-flex> -->
            <v-flex class="text-xs-right">
              <strong>Envio: </strong>
              {{ (impuesto | currency) }}
            </v-flex>
            <v-flex class="text-xs-right">
              <strong>Total Neto: </strong>
              {{
                (total =
                  parseFloat(totalImpuesto) + parseFloat(totalParcial)).toFixed(
                  2
                ) | currency
              }}
            </v-flex>
             <v-flex class="text-xs-right">
              <strong>Efectivo: </strong>
              
                {{ (pagar | currency) }}
            
            </v-flex>

             <v-flex class="text-xs-right">
              <strong>Cambio: </strong>
              
               {{
                (cambio =
                 parseFloat(pagar).toFixed(2) -
                  (parseFloat(totalImpuesto) + parseFloat(totalParcial)).toFixed(
                  2
                ) ) | currency
              }}
            
            </v-flex>
          </v-flex>

          
          <v-flex xs12 sm12 md12 lg12 xl12>
            <div
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field  v-model="pagar" label="Efectivo a pagar">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn @click="ocultarNuevo()" color="blue darken-1" flat
              >Cancelar</v-btn
            >
            <v-btn v-if="verDet == 0" @click="guardar()" color="success"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import Vue from "vue";
import { AutoCompletePlugin, AutocompletePlugin } from '@syncfusion/ej2-vue-dropdowns';
Vue.use(AutoCompletePlugin);
import axios from "axios";
import jsPDF from "jspdf";
import swal from "sweetalert";
import html2canvas from "html2canvas";
export default {
  data() {
    return {
      ventas: [],
      dialog: false,
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "No. Factura", value: "idfactura" },
        { text: "Vendedor", value: "usuario", sortable: false },
        { text: "Cliente", value: "cliente", sortable: false },
        { text: "Tipo Factura", value: "tipo_comprobante", sortable: false },
        /*         {
          text: "Serie Comprobante",
          value: "serie_comprobante",
          sortable: false,
        },
        {
          text: "Número Comprobante",
          value: "num_comprobante",
          sortable: false,
        }, */
        { text: "Fecha", value: "fecha_hora" },
        { text: "Envio", value: "impuesto", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Artículo", value: "articulo", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Precio", value: "precio", sortable: false },
        { text: "Descuento", value: "descuento", sortable: false },
        { text: "Subtotal", value: "subtotal", sortable: false },
      ],
      detalles: [],
      search: "",
      id: "",
      idcliente: "",
      idusuario: "",
      clientes: [],
      vendedores: [],
      tipo_comprobante: "",
      num_factura: 0,
      comprobantes: ["CONTADO", "CREDITO"],
      impuesto: 0,
      pagar: 0,
      codigo: "",
      verNuevo: 0,
      errorArticulo: null,
      totalParcial: 0,
      totalImpuesto: 0,
      total: 0,
      cambio: 0,
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Artículo", value: "articulo" },
        { text: "Categoría", value: "categoria" },
        { text: "Descripción", value: "descripcion", sortable: false },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Precio Venta", value: "precio_venta", sortable: false },
      ],
      articulos: [],
      texto: "",
      verArticulos: 0,
      verDet: 0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
      comprobanteModal: 0,
      cliente: "",
      vendedor: "",
      num_documento: "",
      fecha_hora: "",
      num_factura: "",
      direccion: "",
      telefono: "",
      email: "",
    };
  },
  computed: {
    calcularTotal: function() {
      var resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado +
          (this.detalles[i].precio * this.detalles[i].cantidad -
            this.detalles[i].descuento);
      }
      return resultado;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.listar();
    this.select();
    this.selectUsuario();
  },
  methods: {
    redirigir() {
      // this.$router.push({ name: "login" });
      this.$store.dispatch("salir");
    },
    imprimir() {
      //window.print();
      var divToPrint=document.getElementById('ticket');
      console.log(divToPrint);
     var newWin=window.open('','Print-Window');

     newWin.document.open();
      
     newWin.document.write('<html><body font color="red" face="Times New Roman" size="+1" onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
    
     newWin.document.close();

     setTimeout(function(){newWin.close();},10);
    },
    crearPDF() {
      //var quotes = document.getElementById("factura");
      var quotes = document.getElementById("ticket");
      html2canvas(quotes).then(function(canvas) {
        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 210;
        //var pageHeight = 295;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        //var doc = new jsPDF("p", "mm", "a4");
        var doc = new jsPDF("p","pt","letter");
        var position = 0;

        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        doc.save("FacturaVenta.pdf");
      });
    },
    mostrarComprobante(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.num_factura = item.idventa;
      this.cliente = item.cliente;
      this.vendedor = item.usuario;
      this.num_documento = item.num_documento;
      this.fecha_hora = item.fecha_hora;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
      this.impuesto = item.impuesto;
      this.listarDetalles(item.idventa);
      this.comprobanteModal = 1;
    },
    ocultarComprobante() {
      this.comprobanteModal = 0;
      this.limpiar();
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    buscarCodigo() {
      let me = this;
      me.errorArticulo = null;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/BuscarCodigoVenta/" + this.codigo, configuracion)
        .then(function(response) {
          //console.log(response);
          this.codigo = "";
          me.agregarDetalle(response.data);
        })
        .catch(function(error) {
          console.log(error);
          me.errorArticulo = "No existe el artículo";
        });
      
    },
    listarArticulo() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Articulos/ListarVenta/" + me.texto, configuracion)
        .then(function(response) {
          //console.log(response);
          me.articulos = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    mostrarArticulos() {
      this.verArticulos = 1;
    },
    ocultarArticulos() {
      this.verArticulos = 0;
    },
    agregarDetalle(data = []) {
      this.errorArticulo = null;
      if (this.encuentra(data["idarticulo"])) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        this.detalles.push({
          idarticulo: data["idarticulo"],
          articulo: data["nombre"],
          cantidad: 1,
          precio: data["precio_venta"],
          descuento: 0,
        });
      }
    },
    encuentra(id) {
      var sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i].idarticulo == id) {
          sw = 1;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      var i = arr.indexOf(item);
      if (i !== -1) {
        arr.splice(i, 1);
      }
    },

    listar() {
      var dias = 90;
      var TuFecha = new Date();
      var resultado;

      //dias a sumar
      var dias = parseInt(dias);

      //nueva fecha sumada
      TuFecha.setDate(TuFecha.getDate() + dias);
      //formato de salida para la fecha
      /*resultado = TuFecha.getDate() + '/' +
    (TuFecha.getMonth() + 1) + '/' + TuFecha.getFullYear();*/
      resultado = TuFecha.getDay();
      //console.log("Mier"+TuFecha);
      // alert(TuFecha);
      var fecha;

      // hoy.setDate(fecha.getDate() + dias);
      //fecha = hoy.setDate(hoy.getDay()+dias);
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      let url = "";
      if (!me.search) {
        url = "api/Ventas/Listar";
      } else {
        url = "api/Ventas/ListarFiltro/" + me.search;
      }
      axios
        .get(url, configuracion)
        .then(function(response) {
          //console.log("La fecha de hoy es: "+hoy);
          me.ventas = response.data;
        })
        .catch(function(error) {
          
          if (error.response.status == "401") {
            //alert("Nice");
            swal(
              "Sesión caducada",
              "Su sesión ha expirado favor volver a iniciar sesión",
              "warning"
            );
            me.redirigir();

            //router.push("login");
            // ation.href = "http://localhost8080/login";
          }
        });
    },
    listarDetalles(id) {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Ventas/ListarDetalles/" + id, configuracion)
        .then(function(response) {
          //console.log(response);
          me.detalles = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    verDetalles(item) {
      this.limpiar();
      this.tipo_comprobante = item.tipo_comprobante;
      this.idcliente = item.idcliente;
      this.idusuario = item.idusuario;
      this.impuesto = item.impuesto;
      this.cambio = item.cambio;
      this.pagar = item.pagar;
      this.listarDetalles(item.idventa);
      this.verNuevo = 1;
      this.verDet = 1;
    },
    select() {
      let me = this;
      var clientesArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Personas/SelectClientes", configuracion)
        .then(function(response) {
          clientesArray = response.data;
          console.log(clientesArray);
          clientesArray.map(function(x) {
            me.clientes.push({ text: x.nombre, value: x.idpersona });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    selectUsuario() {
      let me = this;
      var usuariosArray = [];
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .get("api/Usuarios/Select", configuracion)
        .then(function(response) {
          usuariosArray = response.data;
          usuariosArray.map(function(x) {
            me.vendedores.push({ text: x.nombre, value: x.idusuario });
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    limpiar() {
      this.id = "";
      this.idcliente = "";
      this.idusuario = "";
      this.tipo_comprobante = "";
      this.impuesto = 0;
      this.codigo = "";
      this.detalles = [];
      this.validaMensaje = [];
      this.total = 0;
      this.pagar = 0;
      this.cambio = 0;
      this.totalImpuesto = 0;
      this.totalParcial = 0;
      this.verDet = 0;
    },
    guardar() {
      if (this.validar()) {
        return;
      }
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      let me = this;
      axios
        .post(
          "api/Ventas/Crear",
          {
            idcliente: me.idcliente,
            idusuario: me.idusuario,
            //idusuario: me.$store.state.usuario.idusuario,
            tipo_comprobante: me.tipo_comprobante,
            impuesto: me.impuesto,
            total: me.total,
            detalles: me.detalles,
          },
          configuracion
        )
        .then(function(response) {
          swal(
            "Venta realizada",
            "La venta se ha realizado correctamente",
            "success"
          );
          me.ocultarNuevo();
          me.listar();
          me.limpiar();
        })
        .catch(function(error) {
          swal(
            "Error al realizar venta",
            "La venta no se ha realizado correctamente",
            "error"
          );
          console.log(error);
        });
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      
       if (parseFloat(parseFloat(this.pagar).toFixed(2)) < parseFloat(parseFloat(this.total).toFixed(2))){
         this.validaMensaje.push(
          "El precio a pagar no puede ser menor al total neto"
        );
      }

      if (!this.idcliente) {
        this.validaMensaje.push("Seleccione un cliente.");
      }
      if (!this.idusuario) {
        this.validaMensaje.push("Seleccione un vendedor.");
      }
      if (!this.tipo_comprobante) {
        this.validaMensaje.push("Seleccione un tipo de factura.");
      }
      /*if (!this.num_comprobante) {
        this.validaMensaje.push("Ingrese el número del comprobante.");
      }*/
      if (this.impuesto < 0) {
        this.validaMensaje.push("Ingrese un envio válido.");
      }
      if (this.cantidad <= 0) {
        this.validaMensaje.push("Ingrese una cantidad válida.");
      }

      /* if (this.cantidad > cantidad) {
        this.validaMensaje.push("No se hay sufiente stock en el articulo.");
      }*/

      if (this.detalles.length <= 0) {
        this.validaMensaje.push("Ingrese al menos un artículo al detalle.");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.num_comprobante;
      this.adId = item.idventa;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    /*
            activar(){
                let me=this;
                let header={"Authorization" : "Bearer " + this.$store.state.token};
                let configuracion= {headers : header};
                axios.put('api/Usuarios/Activar/'+this.adId,{},configuracion).then(function(response){
                    me.adModal=0;
                    me.adAccion=0;
                    me.adNombre="";
                    me.adId="";
                    me.listar();                       
                }).catch(function(error){
                    console.log(error);
                });
            },
            */
    desactivar() {
      let me = this;
      let header = { Authorization: "Bearer " + this.$store.state.token };
      let configuracion = { headers: header };
      axios
        .put("api/Ventas/Anular/" + this.adId, {}, configuracion)
        .then(function(response) {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
};
</script>

<style >
@import url(https://cdn.syncfusion.com/ej2/material.css);
/*#factura {
  padding: 20px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

#logo {
  float: left;
  margin-left: 2%;
  margin-right: 2%;
}
#imagen {
  width: 150px;
}

#fact {
  font-size: 18px;
  color: #2183e3;
  font-weight: bold;
  text-align: center;
}

#datos {
  float: left;
  margin-top: 0%;
  margin-left: 2%;
  margin-right: 2%;
  /*text-align: justify;*/
/*}
/*
#encabezado {
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 16px;
}

section {
  clear: left;
}

#cliente {
  /*text-align: left;*/
  /*text-align: center;
}
/*
#facliente {
  width: 40%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 15px;
}

#fa {
  color: #ffffff;
  font-size: 14px;
}

#facarticulo {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  padding: 20px;
  margin-bottom: 15px;
}

#facarticulo thead {
  padding: 20px;
  background: #2183e3;
  text-align: center;
  border-bottom: 1px solid #ffffff;
}
#nombreFactura {
  margin-top: 20px;
  font-size: 40px;
  color: #2183e3;
  font-family: cursive;
  margin-right: 120px;
}

#gracias {
  text-align: center;
}
#datosFactura {
  text-align: center;
}

#detalles {
  text-align: center;
}*/

#logo {
  margin: 0 auto;
}
#imagen {
  width: 30px;
  margin-top: 0px;
  margin-bottom: 0px;

}
td,
th,
tr,
table {
    border-top: 1px solid black;
    border-collapse: collapse;
    
}

td.producto,
th.producto {
    width: 60px;
    text-align: center;
    max-width: 40px;
    font-size: 8px;
    font-family: 'Times New Roman';
    word-break: break-all;
}

td.cantidad,
th.cantidad {
    text-align: center;
    width: 40px;
    max-width: 60px;
    word-break: normal;
    font-size: 8px;  
    font-family: 'Times New Roman';
}

td.precio,
th.precio {
    width: 60px;
    margin-left: 200px;
    max-width: 40px;
    font-size: 8px;
    text-align: center;;
    font-family: 'Times New Roman';
    word-break: break-all;
}

#centrado {
    text-align: center;
    align-content: center;
    font-weight: bold;
}

.centrado {
    text-align: center;
    align-content: center;
    font-weight: bold;
}
.texto{
   text-align: center;
    align-content: center;
    margin: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    
}

#ticket {
    width: 255px;
    max-width: 255px;
    font-size: 10px;
    text-align: center;
    font-family: Arial,sans-serif;
    margin-left: 40px;
    
}
/* #ticket .precio {
    width: 60px;
    margin-left: 100px;
    max-width: 40px;
    font-size: 8px;
    text-align: center;;
    font-family: 'Times New Roman';
    word-break: break-all;
    
} */

.okas{
  border-top-style: dotted;
}
img {
    max-width: inherit;
    width: inherit;
}
@media print {
    .oculto-impresion,
    .oculto-impresion * {
        display: none !important;
    }
}
</style>
